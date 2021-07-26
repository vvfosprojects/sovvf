using Microsoft.Extensions.Configuration;
using SO115App.API.Models.Classi.Composizione;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.ComposizioneMezzi;
using SO115App.ExternalAPI.Client;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.GestioneTipologie;
using SO115App.Models.Servizi.Infrastruttura.GestioneStatoOperativoSquadra;
using SO115App.Models.Servizi.Infrastruttura.GetComposizioneMezzi;
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
        private readonly OrdinamentoMezzi _ordinamento;

        private readonly IGetSquadre _getSquadre;
        private readonly IGetStatoSquadra _getStatoSquadre;

        private readonly IGetMezziUtilizzabili _getMezziUtilizzabili;
        private readonly IGetStatoMezzi _getMezziPrenotati;

        private readonly IGetTipologieByCodice _getTipologieCodice;
        private readonly IGetRichiesta _getRichiesta;

        private readonly IConfiguration _config;

        public GetComposizioneMezzi(IGetRichiesta getRichiesta, IGetStatoMezzi getMezziPrenotati, IGetStatoSquadra getStatoSquadre, IGetSquadre getSquadre, IGetMezziUtilizzabili getMezziUtilizzabili, IGetTipologieByCodice getTipologieCodice, IConfiguration config, IHttpRequestManager<Google_API.DistanceMatrix> clientMatrix)
        {
            _getMezziPrenotati = getMezziPrenotati;
            _getMezziUtilizzabili = getMezziUtilizzabili;
            _config = config;
            _getTipologieCodice = getTipologieCodice;
            _getSquadre = getSquadre;
            _getStatoSquadre = getStatoSquadre;
            _getRichiesta = getRichiesta;
            _ordinamento = new OrdinamentoMezzi(_getTipologieCodice, _config, clientMatrix);
        }

        public List<ComposizioneMezzi> Get(ComposizioneMezziQuery query)
        {
            var statiOperativiMezzi = _getMezziPrenotati.Get(query.CodiciSedi);

            var lstSquadrePreaccoppiate = query.CodiciSedi.Select(sede => 
            _getSquadre.GetAllByCodiceDistaccamento(sede.Split('.')[0]))
                .SelectMany(shift => 
                shift.Result.All.Where(s => s.CodiciMezziPreaccoppiati?.Any() ?? false));

            var lstStatiSquadre = _getStatoSquadre.Get(query.CodiciSedi.ToList());

            var lstMezziComposizione = _getMezziUtilizzabili.GetBySedi(query.CodiciSedi.ToArray()) //OTTENGO I DATI
            .ContinueWith(mezzi => //MAPPING
            {
                var lstMezzi = new ConcurrentBag<ComposizioneMezzi>();

                Parallel.ForEach(mezzi.Result, m =>
                {
                    var lstSqPreacc = lstSquadrePreaccoppiate?.Where(sq => sq.CodiciMezziPreaccoppiati?.Contains(m.Codice) ?? false)?.Select(sq => new SquadraPreaccoppiata()
                    {
                        Codice = sq.Codice,
                        Stato = lstStatiSquadre?.FirstOrDefault(s => s.CodMezzo.Equals(m.Codice))?.StatoSquadra ?? Costanti.MezzoInSede,
                        Descrizione = sq.Descrizione,
                        Distaccamento = sq.Distaccamento,
                        Genere = sq.spotType,
                        Turno = sq.TurnoAttuale.ToCharArray()[0]
                    }).ToList();

                    m.PreAccoppiato = lstSqPreacc.Count > 0;

                    string codRichiesta = statiOperativiMezzi.Find(stato => m.Codice.Equals(stato.CodiceMezzo))?.CodiceRichiesta;

                    var mc = new ComposizioneMezzi()
                    {
                        Id = m.Codice,
                        Mezzo = m,
                        IndirizzoIntervento = string.IsNullOrEmpty(codRichiesta) ? null : _getRichiesta.GetByCodice(codRichiesta)?.Localita.Indirizzo,
                        SquadrePreaccoppiate = lstSqPreacc
                    };

                    //var indice = _ordinamento.GetIndiceOrdinamento(query.Richiesta, mc);

                    var statoMezzo = statiOperativiMezzi.Find(x => x.CodiceMezzo.Equals(mc.Mezzo.Codice));

                    if (statoMezzo != null) switch (mc.Mezzo.Stato)
                    {
                        case Costanti.MezzoInSede:
                            mc.Mezzo.Stato = statiOperativiMezzi.Find(x => x.CodiceMezzo.Equals(mc.Mezzo.Codice)).StatoOperativo;
                            break;

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
            }).ContinueWith(lstmezzi => lstmezzi.Result.Where(mezzo => //FILTRAGGIO
            {
                bool ricerca = query.Filtro?.Ricerca?.ToUpper()?.Contains(mezzo.Mezzo.Codice.ToUpper()) ?? true;

                bool distaccamento = string.IsNullOrEmpty(query.Filtro.CodDistaccamentoSelezionato) ?
                    query.Filtro.CodiciDistaccamenti?.Contains(mezzo.Mezzo.Distaccamento.Codice ) ?? true :
                    query.Filtro.CodDistaccamentoSelezionato.Equals(mezzo.Mezzo.Distaccamento?.Codice);

                bool genere = query.Filtro?.Tipo?.Contains(mezzo.Mezzo.Genere) ?? true;

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
                    .ThenByDescending(mezzo => query.Richiesta.Competenze[0].Codice.Equals(mezzo.Mezzo.Distaccamento.Codice))
                    .ThenByDescending(mezzo => query.Richiesta.Competenze[1].Codice.Equals(mezzo.Mezzo.Distaccamento.Codice))
                    .ThenByDescending(mezzo => query.Richiesta.Competenze[2].Codice.Equals(mezzo.Mezzo.Distaccamento.Codice))
                    .ThenBy(mezzo => mezzo.Mezzo.Distaccamento.Codice);
                    //.ThenByDescending(mezzo => mezzo.IndiceOrdinamento);
            });

            var result = lstMezziComposizione.Result.ToList();

            return result;
        }
    }
}
