using Serilog;
using SO115App.API.Models.Classi.Composizione;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Organigramma;
using SO115App.API.Models.Classi.Utenti;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.ComposizioneMezzi;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Classi.ServiziEsterni.OPService;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.GestioneStatoOperativoSquadra;
using SO115App.Models.Servizi.Infrastruttura.GetComposizioneMezzi;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Gac;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Mezzi;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.OPService;
using SO115App.Models.Servizi.Infrastruttura.Turni;
using SO115App.Models.Servizi.Infrastruttura.Utility;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.Composizione
{
    public class GetComposizioneMezzi : IGetComposizioneMezzi
    {
        private readonly IGetSquadre _getSquadre;
        private readonly IGetStatoSquadra _getStatoSquadre;

        private readonly IGetMezziUtilizzabili _getMezziUtilizzabili;
        private readonly IGetStatoMezzi _getMezziPrenotati;
        private readonly IOrdinamentoMezzi _ordinamento;

        private readonly ISetComposizioneMezzi _setComposizioneMezzi;

        private readonly IGetRichiesta _getRichiesta;

        private readonly IGetSedi _getSedi;
        private readonly IGetSottoSediByCodSede _getSottoSedi;

        private readonly Turno TurnoAttuale;
        private readonly Turno TurnoPrecedente;
        private readonly Turno TurnoSuccessivo;

        public GetComposizioneMezzi(IGetSedi getSedi,
            IGetStatoMezzi getMezziPrenotati, IGetStatoSquadra getStatoSquadre,
            IGetSquadre getSquadre, IGetMezziUtilizzabili getMezziUtilizzabili,
            IOrdinamentoMezzi ordinamento, ISetComposizioneMezzi setComposizioneMezzi,
            IGetTurno getTurno, IGetSottoSediByCodSede getSottoSedi, IGetRichiesta getRichiesta)
        {
            _getSedi = getSedi;
            _getMezziPrenotati = getMezziPrenotati;
            _getMezziUtilizzabili = getMezziUtilizzabili;
            _getSquadre = getSquadre;
            _getStatoSquadre = getStatoSquadre;
            _ordinamento = ordinamento;
            _setComposizioneMezzi = setComposizioneMezzi;
            _getSottoSedi = getSottoSedi;
            _getRichiesta = getRichiesta;

            TurnoAttuale = getTurno.Get();
            TurnoPrecedente = getTurno.Get(TurnoAttuale.DataOraInizio.AddMinutes(-1));
            TurnoSuccessivo = getTurno.Get(TurnoAttuale.DataOraFine.AddMinutes(1));
        }

        public List<ComposizioneMezzi> Get(ComposizioneMezziQuery query)
        {
            var lstSedi = _getSedi.GetAll().Result;
            var lstCodiciPin = _getSottoSedi.Get(query.CodiciSedi).ToList();

            //GESTIONE CODICI SEDI
            if (query.CodiciSedi.Contains("00") || query.CodiciSedi.Contains("001"))
                query.CodiciSedi = lstSedi.Select(s => s.Codice).ToArray();

            var lstSquadreWS = query.CodiciSedi.Select(sede => _getSquadre.GetAllByCodiceDistaccamento(sede.Split('.')[0]).Result).ToList();

            var lstSquadre = new List<SquadraOpService>();

            #region Gestione turno preaccoppiati

            var codiceTurno = "";

            switch (query.Filtro.Turno) //FILTRO PER TURNO
            {
                case TurnoRelativo.Precedente: codiceTurno = TurnoPrecedente.Codice; break;
                case TurnoRelativo.Successivo: codiceTurno = TurnoSuccessivo.Codice; break;
                case TurnoRelativo.Attuale: codiceTurno = TurnoAttuale.Codice; break;
                case null: goto case TurnoRelativo.Attuale;
            }

            if (lstSquadreWS.Count > 0)
            {
                if (lstSquadreWS[0] != null) switch (query.Filtro.Turno)
                    {
                        case TurnoRelativo.Successivo: lstSquadre = lstSquadreWS.Where(s => s != null).SelectMany(shift => shift?.Successivo?.Squadre).ToList(); break;
                        case TurnoRelativo.Precedente: lstSquadre = lstSquadreWS.Where(s => s != null).SelectMany(shift => shift?.Precedente?.Squadre).ToList(); break;
                        case TurnoRelativo.Attuale: lstSquadre = lstSquadreWS.Where(s => s != null).SelectMany(shift => shift?.Attuale?.Squadre).ToList(); break;
                        case null: goto case TurnoRelativo.Attuale;
                    }
            }

            #endregion Gestione turno preaccoppiati

            var lstStatiSquadre = _getStatoSquadre.Get(codiceTurno.Substring(0, 1), lstCodiciPin);
            lstStatiSquadre = lstStatiSquadre.FindAll(s => !s.StatoSquadra.Equals(Costanti.MezzoRientrato));

            var lstSquadrePreaccoppiate = new List<SquadraOpService>();
            if (lstSquadre.Count > 0)
                lstSquadrePreaccoppiate = lstSquadre.Where(s => s.CodiciMezziPreaccoppiati != null && !s.spotType.ToUpper().Equals("MODULE")).ToList();

            var statiOperativiMezzi = _getMezziPrenotati.Get(query.CodiciSedi);

            if (query.Filtro.CodiciDistaccamenti != null)
            {
            }
            var lstMezziComposizione = _getMezziUtilizzabili.GetBySedi(query.CodiciSedi.Distinct().ToArray())
                .ContinueWith(mezzi => //MAPPING
            {
                var lstMezzi = new ConcurrentBag<ComposizioneMezzi>();

                Parallel.ForEach(mezzi.Result, m =>
                {
                    var lstSqPreacc = new List<SquadraSemplice>();

                    if (lstSquadrePreaccoppiate.Count > 0)
                    {
                        lstSqPreacc = Task.Run(() => lstSquadrePreaccoppiate?.Where(sq => sq.CodiciMezziPreaccoppiati?.Contains(m.Codice) ?? false)?.Select(sq => new SquadraSemplice()
                        {
                            Codice = sq.Codice,
                            Nome = sq.Descrizione,
                            Distaccamento = new Sede(sq.Distaccamento),
                            Stato = MappaStatoSquadraDaStatoMezzo.MappaStatoComposizione(lstStatiSquadre.FirstOrDefault(s => $"{sq.Codice}_{sq.TurnoAttuale.Substring(0, 1)}".Equals(s.IdSquadra))?.StatoSquadra ?? Costanti.MezzoInSede),
                            Turno = sq.TurnoAttuale.ToCharArray()[0],
                            Membri = sq.Membri.Select(m => new Componente()
                            {
                                CodiceFiscale = m.CodiceFiscale,
                                DescrizioneQualifica = m.qualifications.FirstOrDefault()?.name,
                                Nominativo = $"{m.LastName} {m.FirstName}",
                                qualifications = m.qualifications,
                                Ruolo = m.qualifications.FirstOrDefault()?.name
                            }).ToList(),
                            IdSquadra = sq.spotId
                        }).ToList()).Result;

                        m.PreAccoppiato = lstSqPreacc.Count > 0;
                    }

                    var lstSquadreInRientro = new List<SquadraSemplice>();

                    if (lstSquadre.Count > 0)
                    {
                        lstSquadreInRientro = Task.Run(() => lstStatiSquadre.Where(s => s.StatoSquadra == Costanti.MezzoInRientro && s.CodMezzo.Equals(m.Codice)).Select(s => new SquadraSemplice()
                        {
                            Codice = s.Codice,
                            IdSquadra = lstSquadre.FirstOrDefault(sq => $"{sq.Codice}_{sq.TurnoAttuale}".Equals(s.IdSquadra))?.spotId,
                            Distaccamento = new Sede(lstSedi.FirstOrDefault(sede => sede?.Codice == s.CodiceSede)?.Descrizione),
                            Nome = s.Codice,
                            Stato = MappaStatoSquadraDaStatoMezzo.MappaStatoComposizione(s.StatoSquadra),
                            Membri = lstSquadre.FirstOrDefault(sq => $"{sq.Codice}_{sq.TurnoAttuale}".Equals(s.IdSquadra))?.Membri.Select(m => new Componente()
                            {
                                CodiceFiscale = m.CodiceFiscale,
                                DescrizioneQualifica = m.Ruolo,
                                Nominativo = $"{m.FirstName} {m.LastName}",
                                Ruolo = m.Ruolo
                            }).ToList(),
                            Turno = s.TurnoSquadra.ToCharArray()[0]
                        }).ToList()).Result;
                    }

                    var mc = new ComposizioneMezzi()
                    {
                        Id = m.Codice,
                        Mezzo = m,
                        IndirizzoIntervento = m.Stato != Costanti.MezzoInSede ? query?.Richiesta?.Localita.Indirizzo : null,
                        SquadrePreaccoppiate = lstSqPreacc,
                        ListaSquadre = lstSquadreInRientro
                    };

                    var statoMezzo = statiOperativiMezzi.Find(x => x.CodiceMezzo.Equals(mc.Mezzo.Codice) && !x.StatoOperativo.Equals(Costanti.MezzoRientrato));

                    if (statoMezzo != null)
                    {
                        mc.Mezzo.Stato = statoMezzo.StatoOperativo;

                        switch (mc.Mezzo.Stato)
                        {
                            // Per commit
                            case Costanti.MezzoInViaggio:
                                mc.IndirizzoIntervento = _getRichiesta.GetByCodice(statoMezzo.CodiceRichiesta).Localita.Indirizzo;
                                mc.Mezzo.IdRichiesta = statoMezzo.CodiceRichiesta;
                                break;

                            case Costanti.MezzoSulPosto:
                                mc.IndirizzoIntervento = _getRichiesta.GetByCodice(statoMezzo.CodiceRichiesta).Localita.Indirizzo;
                                mc.Mezzo.IdRichiesta = statoMezzo.CodiceRichiesta;
                                mc.Km = "0";
                                break;

                            case Costanti.MezzoInRientro:
                                goto case Costanti.MezzoInViaggio;
                        }
                    }
                    else
                    {
                        var sede = lstSedi.FirstOrDefault(s => s.Codice.Equals(mc.Mezzo.Distaccamento.Codice));

                        mc.Mezzo.Coordinate = sede?.Coordinate;
                        mc.Mezzo.CoordinateStrg = sede?.CoordinateString;
                    }

                    m.IdRichiesta = statiOperativiMezzi.FirstOrDefault(s => s.CodiceMezzo == m.Codice)?.CodiceRichiesta;
                    m.CoordinateStrg = m.Distaccamento?.CoordinateString;

                    lstMezzi.Add(mc);
                });

                var lstMezziNuova = _ordinamento.GetIndiceOrdinamento(query.Richiesta, lstMezzi.ToList()).Result;

                //DA REIMPLEMENTARE SE SONO DA SALVARE IN LOCALE I MEZZI
                //if (lstMezziNuova != null || lstMezziNuova.Count > 0 || mezzi.Result != null || mezzi.Result.Count > 0)
                //    _setComposizioneMezzi.Set(lstMezziNuova);

                return lstMezziNuova;
            }).ContinueWith(lstmezzi => lstmezzi.Result?.Where(mezzo => //FILTRAGGIO
            {
                if (string.IsNullOrEmpty(mezzo.Mezzo.Distaccamento?.Descrizione))
                    return false;

                bool ricerca = string.IsNullOrEmpty(query.Filtro?.Ricerca?.ToUpper()) ||
                    mezzo.Mezzo.Codice.ToUpper().Contains(query.Filtro.Ricerca.ToUpper()) ||
                    mezzo.Mezzo.Descrizione.ToUpper().Contains(query.Filtro.Ricerca.ToUpper()) ||
                    mezzo.Mezzo.Genere.ToUpper().Contains(query.Filtro.Ricerca.ToUpper()) ||
                    mezzo.Mezzo.Sigla.ToUpper().Contains(query.Filtro.Ricerca.ToUpper());

                bool competenze = query.Filtro.CodiciDistaccamenti?.Contains(mezzo.Mezzo.Distaccamento?.Codice) ?? true;

                bool distaccamentoSquadra = query.Filtro.CodDistaccamentoSelezionato?.Equals(mezzo.Mezzo.Distaccamento?.Codice) ?? true;

                bool genere = (query.Filtro.Autista == true || query.Filtro.Autista == null) ? query.Filtro?.Tipo?.Contains(mezzo.Mezzo.Genere) ?? true : mezzo.Mezzo.Genere.ToLower().Contains("av");

                bool stato = query.Filtro?.Stato?.Contains(mezzo.Mezzo.Stato) ?? true;

                return ricerca && competenze && genere && stato && distaccamentoSquadra;
            })).ContinueWith(lstMezzi =>
            {
                return lstMezzi.Result //ORDINAMENTO
                .OrderByDescending(mezzo => mezzo.IndiceOrdinamento)
                .OrderBy(mezzo => mezzo.Mezzo.Distaccamento?.Codice)
                .OrderBy(mezzo => !mezzo.SquadrePreaccoppiate.Select(s => s.Codice).Contains(query.Filtro?.CodSquadraSelezionata))
                .OrderBy(mezzo => !query?.Filtro?.CodMezzoSelezionato?.Equals(mezzo.Mezzo.Codice) ?? false)
                .OrderBy(mezzo => !query?.Filtro?.CodDistaccamentoSelezionato?.Equals(mezzo.Mezzo.Codice) ?? false)
                .OrderBy(mezzo => mezzo.Mezzo.Stato.Equals(Costanti.MezzoInSede))
                .OrderBy(mezzo => mezzo.Mezzo.Stato.Equals(Costanti.MezzoInRientro))
                .OrderBy(mezzo => mezzo.Mezzo.Stato.Equals(Costanti.MezzoInViaggio))
                .OrderBy(mezzo => mezzo.Mezzo.Stato.Equals(Costanti.MezzoSulPosto))
                .OrderBy(mezzo => mezzo.Mezzo.Stato.Equals(Costanti.MezzoOccupato))
                .ThenByDescending(mezzo => query.Richiesta.Competenze != null && query.Richiesta.Competenze.Count > 1 ? query.Richiesta.Competenze[0].Codice.Equals(mezzo.Mezzo.Distaccamento.Codice) : false)
                .ThenByDescending(mezzo => query.Richiesta.Competenze != null && query.Richiesta.Competenze.Count > 1 ? query.Richiesta.Competenze[1].Codice.Equals(mezzo.Mezzo.Distaccamento.Codice) : false)
                .ThenByDescending(mezzo => query.Richiesta.Competenze != null && query.Richiesta.Competenze.Count > 2 ? query.Richiesta.Competenze[2].Codice.Equals(mezzo.Mezzo.Distaccamento.Codice) : false)
                //.ThenBy(mezzo => mezzo.Mezzo.Distaccamento?.Codice)
                .ToList();
            });

            return lstMezziComposizione.Result;
        }
    }
}
