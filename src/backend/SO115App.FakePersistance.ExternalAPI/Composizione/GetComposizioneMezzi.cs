using SO115App.API.Models.Classi.Composizione;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.ComposizioneMezzi;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using SO115App.Models.Servizi.Infrastruttura.GestioneStatoOperativoSquadra;
using SO115App.Models.Servizi.Infrastruttura.GetComposizioneMezzi;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Gac;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Mezzi;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.OPService;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
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

        private readonly IGetSedi _getSedi;

        public GetComposizioneMezzi(IGetSedi getSedi,
            IGetStatoMezzi getMezziPrenotati, IGetStatoSquadra getStatoSquadre,
            IGetSquadre getSquadre, IGetMezziUtilizzabili getMezziUtilizzabili,
            IOrdinamentoMezzi ordinamento, ISetComposizioneMezzi setComposizioneMezzi)
        {
            _getSedi = getSedi;
            _getMezziPrenotati = getMezziPrenotati;
            _getMezziUtilizzabili = getMezziUtilizzabili;
            _getSquadre = getSquadre;
            _getStatoSquadre = getStatoSquadre;
            _ordinamento = ordinamento;
            _setComposizioneMezzi = setComposizioneMezzi;
        }

        public List<ComposizioneMezzi> Get(ComposizioneMezziQuery query)
        {
            var lstSedi = _getSedi.GetAll();

            //GESTIONE CODICI SEDI
            if (query.CodiciSedi.Contains("00") || query.CodiciSedi.Contains("001"))
                query.CodiciSedi = lstSedi.Result.Select(s => s.Codice).ToArray();

            var lstSquadreWS = query.CodiciSedi.Select(sede => _getSquadre.GetAllByCodiceDistaccamento(sede.Split('.')[0]).Result).ToList();

            var lstSquadre = new List<Models.Classi.ServiziEsterni.OPService.Squadra>();
            if (lstSquadreWS[0] != null)
                lstSquadre = lstSquadreWS.SelectMany(shift => shift?.Squadre).ToList();

            var lstStatiSquadre = _getStatoSquadre.Get("", query.CodiciSedi.ToList());
            var lstSquadrePreaccoppiate = lstSquadre.Where(s => s.CodiciMezziPreaccoppiati != null && !s.spotType.ToUpper().Equals("MODULE")).ToList();

            var statiOperativiMezzi = _getMezziPrenotati.Get(query.CodiciSedi);

            var lstMezziComposizione = _getMezziUtilizzabili.GetBySedi(query.CodiciSedi.Distinct().ToArray()) //OTTENGO I DATI
            .ContinueWith(mezzi => //MAPPING
            {
                var lstMezzi = new ConcurrentBag<ComposizioneMezzi>();

                Parallel.ForEach(mezzi.Result, m =>
                {
                    var lstSqPreacc = Task.Run(() => lstSquadrePreaccoppiate?.Where(sq => sq.CodiciMezziPreaccoppiati?.Contains(m.Codice) ?? false)?.Select(sq => new SquadraSemplice()
                    {
                        Codice = sq.Codice,
                        Nome = sq.Descrizione,
                        Distaccamento = new Sede(sq.Distaccamento),
                        Turno = sq.TurnoAttuale.ToCharArray()[0]
                    }).ToList());

                    var lstSquadreInRientro = Task.Run(() => lstStatiSquadre.Where(s => s.StatoSquadra == Costanti.MezzoInRientro && s.CodMezzo == m.Codice).Select(s => new SquadraSemplice()
                    {
                        Codice = s.IdSquadra,
                        Distaccamento = new Sede(lstSedi.Result.FirstOrDefault(sede => sede?.Codice == s.CodiceSede)?.Descrizione),
                        Nome = s.IdSquadra,
                        Stato = MappaStatoSquadraDaStatoMezzo.MappaStatoComposizione(s.StatoSquadra),
                        Membri = lstSquadre.FirstOrDefault(sq => sq.Codice.Equals(s.IdSquadra))?.Membri.Select(m => new Componente()
                        {
                            CodiceFiscale = m.CodiceFiscale,
                            DescrizioneQualifica = m.Ruolo,
                            Nominativo = $"{m.FirstName} {m.LastName}",
                            Ruolo = m.Ruolo
                        }).ToList(),
                        Turno = lstSquadre.FirstOrDefault(sq => sq.Codice.Equals(s.IdSquadra))?.TurnoAttuale.ToCharArray()[0] ?? 'X',
                    }).ToList());

                    m.PreAccoppiato = lstSqPreacc.Result?.Count > 0;
                    m.IdRichiesta = statiOperativiMezzi.FirstOrDefault(s => s.CodiceMezzo == m.Codice)?.CodiceRichiesta;

                    Coordinate coordinateMezzo = null;

                    if (m.CoordinateStrg != null)
                    {
                        if (m.CoordinateStrg[0] == null)
                            coordinateMezzo = new Coordinate(m.Distaccamento.Coordinate.Latitudine, m.Distaccamento.Coordinate.Longitudine);
                        else
                            coordinateMezzo = new Coordinate(Convert.ToDouble(m.CoordinateStrg[0]), Convert.ToDouble(m.CoordinateStrg[1]));
                    }

                    var mc = new ComposizioneMezzi()
                    {
                        Id = m.Codice,
                        Mezzo = m,
                        IndirizzoIntervento = m.Stato != Costanti.MezzoInSede ? query?.Richiesta?.Localita.Indirizzo : null,
                        SquadrePreaccoppiate = lstSqPreacc.Result,
                        ListaSquadre = lstSquadreInRientro.Result
                    };

                    var statoMezzo = statiOperativiMezzi.Find(x => x.CodiceMezzo.Equals(mc.Mezzo.Codice));

                    if (statoMezzo != null)
                    {
                        mc.Mezzo.Stato = statoMezzo.StatoOperativo;

                        switch (mc.Mezzo.Stato)
                        {
                            case Costanti.MezzoInViaggio:
                                mc.Mezzo.IdRichiesta = statoMezzo.CodiceRichiesta;
                                break;

                            case Costanti.MezzoSulPosto:
                                mc.IndirizzoIntervento = query.Richiesta.Localita.Indirizzo;
                                mc.Mezzo.IdRichiesta = statoMezzo.CodiceRichiesta;
                                mc.Km = "0";
                                break;

                            case Costanti.MezzoInRientro:
                                goto case Costanti.MezzoInViaggio;
                        }
                    }
                    else
                    {
                        var sede = lstSedi.Result.FirstOrDefault(s => s.Codice.Equals(mc.Mezzo.Distaccamento.Codice));

                        mc.Mezzo.Coordinate = sede?.Coordinate;
                        mc.Mezzo.CoordinateStrg = sede?.CoordinateString;
                    }

                    lstMezzi.Add(mc);
                });

                var lstMezziNuova = _ordinamento.GetIndiceOrdinamento(query.Richiesta, lstMezzi.ToList()).Result;

                if (lstMezziNuova != null || lstMezziNuova.Count > 0 || mezzi.Result != null || mezzi.Result.Count > 0)
                    _setComposizioneMezzi.Set(lstMezziNuova);

                return lstMezziNuova;
            }).ContinueWith(lstmezzi => lstmezzi.Result?.Where(mezzo => //FILTRAGGIO
            {
                if (string.IsNullOrEmpty(mezzo.Mezzo.Distaccamento?.Descrizione))
                    return false;

                bool ricerca = string.IsNullOrEmpty(query.Filtro?.Ricerca?.ToUpper()) ||
                    mezzo.Mezzo.Codice.ToUpper().Contains(query.Filtro.Ricerca.ToUpper()) ||
                    mezzo.Mezzo.Descrizione.ToUpper().Contains(query.Filtro.Ricerca.ToUpper()) ||
                    mezzo.Mezzo.Genere.ToUpper().Contains(query.Filtro.Ricerca.ToUpper());

                bool competenze = query.Filtro.CodiciDistaccamenti?.Contains(mezzo.Mezzo.Distaccamento?.Codice) ?? true;

                bool distaccamentoSquadra = query.Filtro.CodDistaccamentoSelezionato?.Equals(mezzo.Mezzo.Distaccamento?.Codice) ?? true;

                bool genere = (query.Filtro.Autista == true || query.Filtro.Autista == null) ? query.Filtro?.Tipo?.Contains(mezzo.Mezzo.Genere) ?? true : mezzo.Mezzo.Genere.ToLower().Contains("av");

                bool stato = query.Filtro?.Stato?.Contains(mezzo.Mezzo.Stato) ?? true;

                return ricerca && competenze && genere && stato && distaccamentoSquadra;
            })).ContinueWith(lstMezzi =>
            {
                return lstMezzi.Result //ORDINAMENTO
                .OrderByDescending(mezzo => mezzo.IndiceOrdinamento)
                .OrderBy(mezzo => (!query?.Filtro?.CodMezzoSelezionato?.Equals(mezzo.Mezzo.Codice)) ?? false)
                .OrderBy(mezzo => (!query?.Filtro?.CodDistaccamentoSelezionato?.Equals(mezzo.Mezzo.Codice)) ?? false)
                .OrderBy(mezzo => mezzo.Mezzo.Stato.Equals(Costanti.MezzoInSede))
                .OrderBy(mezzo => mezzo.Mezzo.Stato.Equals(Costanti.MezzoInRientro))
                .OrderBy(mezzo => mezzo.Mezzo.Stato.Equals(Costanti.MezzoInViaggio))
                .OrderBy(mezzo => mezzo.Mezzo.Stato.Equals(Costanti.MezzoSulPosto))
                .OrderBy(mezzo => mezzo.Mezzo.Stato.Equals(Costanti.MezzoOccupato))
                //.ThenByDescending(mezzo => query.Richiesta.Competenze[0]?.Codice.Equals(mezzo.Mezzo.Distaccamento.Codice) ?? false)
                //.ThenByDescending(mezzo => query.Richiesta.Competenze.Count > 1 ? query.Richiesta.Competenze[1].Codice.Equals(mezzo.Mezzo.Distaccamento.Codice) : false)
                //.ThenByDescending(mezzo => query.Richiesta.Competenze.Count > 2 ? query.Richiesta.Competenze[2].Codice.Equals(mezzo.Mezzo.Distaccamento.Codice) : false)
                .ThenBy(mezzo => mezzo.Mezzo.Distaccamento?.Codice)
                .ToList();
            });

            return lstMezziComposizione.Result;
        }
    }
}
