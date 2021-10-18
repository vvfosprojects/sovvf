using Microsoft.Extensions.Configuration;
using SO115App.API.Models.Classi.Composizione;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.ComposizioneMezzi;
using SO115App.ExternalAPI.Client;
using SO115App.Models.Classi.Composizione;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.GestioneTipologie;
using SO115App.Models.Servizi.Infrastruttura.GestioneStatoOperativoSquadra;
using SO115App.Models.Servizi.Infrastruttura.GetComposizioneMezzi;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Gac;
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
        //private readonly OrdinamentoMezzi _ordinamento;

        private readonly IGetSquadre _getSquadre;
        private readonly IGetStatoSquadra _getStatoSquadre;

        private readonly IGetMezziUtilizzabili _getMezziUtilizzabili;
        private readonly IGetStatoMezzi _getMezziPrenotati;

        //private readonly IGetTipologieByCodice _getTipologieCodice;
        private readonly IGetSedi _getSedi;

        //private readonly IConfiguration _config;

        public GetComposizioneMezzi(IGetSedi getSedi, IGetStatoMezzi getMezziPrenotati, IGetStatoSquadra getStatoSquadre, IGetSquadre getSquadre, IGetMezziUtilizzabili getMezziUtilizzabili, IGetTipologieByCodice getTipologieCodice, IConfiguration config, IHttpRequestManager<Google_API.DistanceMatrix> clientMatrix)
        {
            _getSedi = getSedi;
            _getMezziPrenotati = getMezziPrenotati;
            _getMezziUtilizzabili = getMezziUtilizzabili;
            //_config = config;
            //_getTipologieCodice = getTipologieCodice;
            _getSquadre = getSquadre;
            _getStatoSquadre = getStatoSquadre;
            //_ordinamento = new OrdinamentoMezzi(_getTipologieCodice, _config, clientMatrix);
        }

        public List<ComposizioneMezzi> Get(ComposizioneMezziQuery query)
        {
            var lstSedi = Task.Run(() => _getSedi.GetAll()
                .Where(s => s.attiva == 1 && s.codFiglio_TC >= 1000)
                .Distinct()
                .Select(s => new DistaccamentoComposizione()
                {
                    Codice = $"{s.codProv}.{s.codFiglio_TC}",
                    Coordinate = new Coordinate(s.latitudine, s.longitudine),
                    Descrizione = s.sede.Replace("Comando VV.F. di ", "Centrale ").Replace("Distaccamento Cittadino ", "").ToUpper(),
                    Provincia = s.codProv
                })).Result;

            //GESTIONE CODICI SEDI
            if (query.CodiciSedi.Contains("CON"))
                query.CodiciSedi = lstSedi.Select(s => s.Codice).Where(s => s.Contains('.')).Distinct().ToArray();
            else
                query.CodiciSedi = query.CodiciSedi.Where(s => s.Contains('.')).Distinct().ToArray();

            var lstSquadre = Task.Run(() => query.CodiciSedi.Select(sede => _getSquadre.GetAllByCodiceDistaccamento(sede.Split('.')[0])).SelectMany(shift => shift.Result.Squadre).ToList());
            var lstStatiSquadre = Task.Run(() => _getStatoSquadre.Get(query.CodiciSedi.ToList()));

            var lstSquadrePreaccoppiate = Task.Run(() => lstSquadre.Result?.Where(s => s.CodiciMezziPreaccoppiati != null).ToList());

            var statiOperativiMezzi = Task.Run(() => _getMezziPrenotati.Get(query.CodiciSedi));
            var lstMezziComposizione = _getMezziUtilizzabili.GetBySedi(query.CodiciSedi.ToArray()) //OTTENGO I DATI
            .ContinueWith(mezzi => //MAPPING
            {
                var lstMezzi = new ConcurrentBag<ComposizioneMezzi>();

                Parallel.ForEach(mezzi.Result, m =>
                {
                    var lstSqPreacc = Task.Run(() => lstSquadrePreaccoppiate?.Result.Where(sq => sq.CodiciMezziPreaccoppiati?.Contains(m.Codice) ?? false)?.Select(sq => new SquadraSemplice()
                    {
                        Codice = sq.Codice,
                        //Stato = (StatoSquadraComposizione)Enum.Parse(typeof(StatoSquadraComposizione), lstStatiSquadre?.FirstOrDefault(s => s.CodMezzo.Equals(m.Codice))?.StatoSquadra ?? Costanti.MezzoInSede),
                        //Stato = MappaStatoSquadraDaStatoMezzo.MappaStatoComposizione(lstStatiSquadre.Result?.FirstOrDefault(stato => stato.IdSquadra.Equals(sq.Codice))?.StatoSquadra),
                        //Stato = MappaStatoSquadraDaStatoMezzo.MappaStatoComposizione(sq.Stato),
                        Nome = sq.Descrizione,
                        //Membri = 
                        Distaccamento = new Sede(sq.Distaccamento),
                        Turno = sq.TurnoAttuale.ToCharArray()[0]
                    }).ToList());

                    var lstSquadreInRientro = Task.Run(() => lstStatiSquadre.Result?.FindAll(s => s.StatoSquadra == Costanti.MezzoInRientro && s.CodMezzo == m.Codice).Select(s => new SquadraSemplice()
                    {
                        Codice = s.IdSquadra,
                        Distaccamento = new Sede(lstSedi?.FirstOrDefault(sede => sede.Codice == s.CodiceSede)?.Descrizione),
                        Nome = s.IdSquadra,
                        Stato = MappaStatoSquadraDaStatoMezzo.MappaStatoComposizione(s.StatoSquadra),
                        Membri = lstSquadre.Result.First(sq => sq.Codice.Equals(s.IdSquadra)).Membri.Select(m => new Componente()
                        {
                            CodiceFiscale = m.CodiceFiscale,
                            DescrizioneQualifica = m.Ruolo,
                            Nominativo = $"{m.FirstName} {m.LastName}",
                            Ruolo = m.Ruolo
                        }).ToList(),
                        Turno = lstSquadre.Result.First(sq => sq.Codice.Equals(s.IdSquadra)).TurnoAttuale.ToCharArray()[0],
                    }).ToList());

                    m.PreAccoppiato = lstSqPreacc.Result?.Count > 0;
                    m.IdRichiesta = statiOperativiMezzi.Result?.Find(s => s.CodiceMezzo == m.Codice)?.CodiceRichiesta;

                    var mc = new ComposizioneMezzi()
                    {
                        Id = m.Codice,
                        Mezzo = m,
                        IndirizzoIntervento = m.Stato != Costanti.MezzoInSede ? query?.Richiesta?.Localita.Indirizzo : null,
                        SquadrePreaccoppiate = lstSqPreacc.Result,
                        ListaSquadre = lstSquadreInRientro.Result,
                        Km = "1234",
                        TempoPercorrenza = "123"
                    };

                    //var indice = _ordinamento.GetIndiceOrdinamento(query.Richiesta, mc);

                    var statoMezzo = statiOperativiMezzi.Result?.Find(x => x.CodiceMezzo.Equals(mc.Mezzo.Codice));

                    if (statoMezzo != null) switch (mc.Mezzo.Stato)
                    {
                        //case Costanti.MezzoInSede:
                        //    mc.Mezzo.Stato = statiOperativiMezzi.Result?.Find(x => x.CodiceMezzo.Equals(mc.Mezzo.Codice)).StatoOperativo;
                        //    break;

                        case Costanti.MezzoInViaggio:
                            mc.Mezzo.IdRichiesta = statoMezzo.CodiceRichiesta;
                            break;

                        case Costanti.MezzoSulPosto:
                            mc.IndirizzoIntervento = query.Richiesta.Localita.Indirizzo;
                            mc.Mezzo.IdRichiesta = statoMezzo.CodiceRichiesta;
                            break;

                        case Costanti.MezzoInRientro:
                            mc.Mezzo.IdRichiesta = statoMezzo.CodiceRichiesta;
                            break;
                    }

                    //mc.IndiceOrdinamento = indice.Result;

                    lstMezzi.Add(mc);
                });

                return lstMezzi;
            }).ContinueWith(lstmezzi => lstmezzi.Result?.Where(mezzo => //FILTRAGGIO
            {
                bool ricerca = string.IsNullOrEmpty(query.Filtro?.Ricerca?.ToUpper()) ||
                    mezzo.Mezzo.Codice.ToUpper().Contains(query.Filtro.Ricerca.ToUpper()) || 
                    mezzo.Mezzo.Descrizione.ToUpper().Contains(query.Filtro.Ricerca.ToUpper());

                bool distaccamento = string.IsNullOrEmpty(query.Filtro.CodDistaccamentoSelezionato) ?
                    query.Filtro.CodiciDistaccamenti?.Contains(mezzo.Mezzo.Distaccamento.Codice ) ?? true :
                    query.Filtro.CodDistaccamentoSelezionato.Equals(mezzo.Mezzo.Distaccamento?.Codice);

                bool genere = (query.Filtro.Autista == true || query.Filtro.Autista == null) ? query.Filtro?.Tipo?.Contains(mezzo.Mezzo.Genere) ?? true : mezzo.Mezzo.Genere.ToLower().Contains("aps");

                bool stato = query.Filtro?.Stato?.Contains(mezzo.Mezzo.Stato) ?? true;

                return ricerca && distaccamento && genere && stato;
            })).ContinueWith(lstMezzi => //ORDINAMENTO
            {
                return lstMezzi.Result
                    .OrderBy(mezzo => (!query?.Filtro?.CodMezzoSelezionato?.Equals(mezzo.Mezzo.Codice)) ?? false)
                    .OrderBy(mezzo => (!query?.Filtro?.CodDistaccamentoSelezionato?.Equals(mezzo.Mezzo.Codice)) ?? false)
                    .OrderBy(mezzo => mezzo.Mezzo.Stato.Equals(Costanti.MezzoInSede))
                    .OrderBy(mezzo => mezzo.Mezzo.Stato.Equals(Costanti.MezzoInRientro))
                    .OrderBy(mezzo => mezzo.Mezzo.Stato.Equals(Costanti.MezzoInViaggio))
                    .OrderBy(mezzo => mezzo.Mezzo.Stato.Equals(Costanti.MezzoSulPosto))
                    .OrderBy(mezzo => mezzo.Mezzo.Stato.Equals(Costanti.MezzoOccupato))
                    .ThenByDescending(mezzo => query.Richiesta.Competenze[0]?.Codice.Equals(mezzo.Mezzo.Distaccamento.Codice) ?? false)
                    .ThenByDescending(mezzo => query.Richiesta.Competenze.Count > 1 ? query.Richiesta.Competenze[1].Codice.Equals(mezzo.Mezzo.Distaccamento.Codice) : false)
                    .ThenByDescending(mezzo => query.Richiesta.Competenze.Count > 2 ? query.Richiesta.Competenze[2].Codice.Equals(mezzo.Mezzo.Distaccamento.Codice) : false)
                    .ThenBy(mezzo => mezzo.Mezzo.Distaccamento.Codice);
                    //.ThenByDescending(mezzo => mezzo.IndiceOrdinamento);
            });

            var result = lstMezziComposizione.Result.ToList();

            return result;
        }
    }
}
