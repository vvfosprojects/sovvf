using Microsoft.Extensions.Configuration;
using SO115App.API.Models.Classi.Composizione;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.ComposizioneMezzi;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.GestioneTipologie;
using SO115App.Models.Servizi.Infrastruttura.GetComposizioneMezzi;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Gac;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.Composizione
{
    public class GetComposizioneMezzi : IGetComposizioneMezzi
    {
        private readonly IGetMezziUtilizzabili _getMezziUtilizzabili;
        private readonly IGetStatoMezzi _getMezziPrenotati;
        private readonly IGetTipologieByCodice _getTipologieCodice;
        private readonly IConfiguration _config;

        public GetComposizioneMezzi(IGetStatoMezzi getMezziPrenotati, IGetMezziUtilizzabili getMezziUtilizzabili, IGetTipologieByCodice getTipologieCodice, IConfiguration config)
        {
            _getMezziPrenotati = getMezziPrenotati;
            _getMezziUtilizzabili = getMezziUtilizzabili;
            _config = config;
            _getTipologieCodice = getTipologieCodice;
        }

        public List<ComposizioneMezzi> Get(ComposizioneMezziQuery query)
        {
            var statiOperativiMezzi = _getMezziPrenotati.Get(query.CodiciSedi); //OTTENGO I DATI

            var lstMezziComposizione = _getMezziUtilizzabili.Get(query.CodiciSedi.ToList())
            .ContinueWith(mezzi => //MAPPING
            {
                var lstMezzi = new ConcurrentBag<ComposizioneMezzi>();

                Parallel.ForEach(mezzi.Result, m =>
                {
                    var mc = new ComposizioneMezzi()
                    {
                        Id = m.Codice,
                        Mezzo = m,
                        Km = new Random().Next(1, 60).ToString(),
                        TempoPercorrenza = Math.Round(Convert.ToDouble(new Random().Next(1, 60).ToString().Replace(".", ",")) / 1.75, 2).ToString(CultureInfo.InvariantCulture),
                    };

                    //TODO OTTIMIZZARE INDICE ORDINAMENTO
                    //mc.IndiceOrdinamento = new OrdinamentoMezzi(_getTipologieCodice, _config).GetIndiceOrdinamento(query.Richiesta, mc);

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

                    lstMezzi.Add(mc);
                });

                return lstMezzi;
            }).ContinueWith(lstmezzi => lstmezzi.Result.Where(mezzo => //FILTRAGGIO
            {
                var ricerca = query.Filtro?.Ricerca?.Contains(mezzo.Mezzo.Codice) ?? true;

                bool distaccamento = string.IsNullOrEmpty(query.Filtro.CodDistaccamentoSelezionato) ?
                    query.Filtro.CodiciDistaccamenti.Contains(mezzo.Mezzo.Distaccamento.Codice ) :
                    query.Filtro.CodDistaccamentoSelezionato.Equals(mezzo.Mezzo.Distaccamento?.Codice);

                var genere = mezzo.Mezzo.Genere.Contains(query.Filtro?.Tipo ?? mezzo.Mezzo.Genere);

                var stato = mezzo.Mezzo.Stato.Equals(query.Filtro?.Stato ?? mezzo.Mezzo.Stato);

                return ricerca && distaccamento && genere && stato;
            }));

            return lstMezziComposizione.Result
                .OrderBy(mezzo => query.Richiesta.Competenze[0].Codice.Equals(mezzo.Mezzo.Distaccamento.Codice))
                .OrderBy(mezzo => query.Richiesta.Competenze[1].Codice.Equals(mezzo.Mezzo.Distaccamento.Codice))
                .OrderBy(mezzo => query.Richiesta.Competenze[2].Codice.Equals(mezzo.Mezzo.Distaccamento.Codice))
                //.ThenBy(mezzo => mezzo.Mezzo.Stato.Equals(Costanti.MezzoInSede))
                //.ThenBy(mezzo => mezzo.Mezzo.Stato.Equals(Costanti.MezzoInRientro))
                //.ThenBy(mezzo => mezzo.Mezzo.Stato.Equals(Costanti.MezzoInViaggio))
                //.ThenBy(mezzo => mezzo.Mezzo.Stato.Equals(Costanti.MezzoSulPosto))
                //.ThenBy(mezzo => mezzo.Mezzo.Stato.Equals(Costanti.MezzoStatoSconosciuto))
                //.ThenByDescending(mezzo  => mezzo.IndiceOrdinamento)
                .ToList();
        }
    }
}
