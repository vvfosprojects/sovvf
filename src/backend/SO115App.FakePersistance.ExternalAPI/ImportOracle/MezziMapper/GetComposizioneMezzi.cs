using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Composizione;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.ComposizioneMezzi;
using SO115App.FakePersistence.JSon.Utility;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.GetComposizioneMezzi;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Gac;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Squadre;
using SO115App.Persistence.MongoDB.GestioneMezzi;

namespace SO115App.ExternalAPI.Fake.ImportOracle.MezziMapper
{
    public class GetComposizioneMezzi : IGetComposizioneMezzi
    {
        private readonly IGetStatoMezzi _getMezziPrenotati;
        private readonly OrdinamentoMezzi _ordinamentoMezzi;
        private readonly IGetMezziUtilizzabili _getMezziUtilizzabili;
        private readonly IGetListaSquadre _getSquadre;

        public GetComposizioneMezzi(IGetStatoMezzi getMezziPrenotati, OrdinamentoMezzi ordinamentoMezzi, IGetMezziUtilizzabili getMezziUtilizzabili, IGetListaSquadre getSquadre)
        {
            _getMezziUtilizzabili = getMezziUtilizzabili;
            _getSquadre = getSquadre;
            _getMezziPrenotati = getMezziPrenotati;
            _ordinamentoMezzi = ordinamentoMezzi;
        }

        public List<ComposizioneMezzi> Get(ComposizioneMezziQuery query)
        {
            List<string> ListaSedi = new List<string>();
            ListaSedi.Add(query.CodiceSede);
            List<Mezzo> ListaMezzi = _getMezziUtilizzabili.Get(ListaSedi).Result;

            var composizioneMezzi = GeneraListaComposizioneMezzi(ListaMezzi);
            var ListaSquadre = _getSquadre.Get(ListaSedi).Result;
            string[] generiMezzi;
            string[] statiMezzi;
            string codiceDistaccamento;
            if (query.Filtro.CodiceDistaccamento?.Length > 0 && !string.IsNullOrEmpty(query.Filtro.CodiceDistaccamento[0])
                || query.Filtro.CodiceMezzo?.Length > 0 && !string.IsNullOrEmpty(query.Filtro.CodiceMezzo)
                || query.Filtro.CodiceSquadra?.Length > 0 && !string.IsNullOrEmpty(query.Filtro.CodiceSquadra[0])
                || query.Filtro.CodiceStatoMezzo?.Length > 0 && !string.IsNullOrEmpty(query.Filtro.CodiceStatoMezzo[0])
                || query.Filtro.CodiceTipoMezzo?.Length > 0 && !string.IsNullOrEmpty(query.Filtro.CodiceTipoMezzo[0]))
            {
                if (query.Filtro.CodiceSquadra?.Length > 0 && !string.IsNullOrEmpty(query.Filtro.CodiceSquadra[0]))
                {
                    var composizioneSquadre = new List<ComposizioneSquadre>();
                    foreach (Squadra s in ListaSquadre)
                    {
                        ComposizioneSquadre c = new ComposizioneSquadre();
                        c.Squadra = s;
                        c.Id = s.Id;
                        composizioneSquadre.Add(c);
                    }
                    var squadra = composizioneSquadre.Find(x => query.Filtro.CodiceSquadra.Any(x.Squadra.Id.Equals));
                    if (squadra != null)
                    {
                        codiceDistaccamento = squadra.Squadra.Distaccamento.Codice;
                        composizioneMezzi = composizioneMezzi.Where(x => x.Mezzo.Distaccamento.Codice == codiceDistaccamento).ToList();
                    }
                }

                var pathFiltri = CostantiJson.Filtri;
                string jsonFiltri;
                using (var r = new StreamReader(pathFiltri))
                {
                    jsonFiltri = r.ReadToEnd();
                }
                var filtri = JsonConvert.DeserializeObject<API.Models.Classi.Filtri.Filtri>(jsonFiltri);

                if (query.Filtro.CodiceDistaccamento?.Length > 0
                    && !string.IsNullOrEmpty(query.Filtro.CodiceDistaccamento[0]))
                {
                    composizioneMezzi = composizioneMezzi.Where(x => query.Filtro.CodiceDistaccamento.Any(x.Mezzo.Distaccamento.Codice.Equals)).ToList();
                }

                if (query.Filtro.CodiceStatoMezzo?.Length > 0 && !string.IsNullOrEmpty(query.Filtro.CodiceStatoMezzo[0]))
                {
                    statiMezzi = filtri.Stati.Where(x => query.Filtro.CodiceStatoMezzo.Any(x.codice.Equals)).Select(x => x.Descrizione).ToArray();
                    composizioneMezzi = composizioneMezzi.Where(x => statiMezzi.Any(x.Mezzo.Stato.Equals)).ToList();
                }

                if (query.Filtro.CodiceTipoMezzo?.Length > 0 && !string.IsNullOrEmpty(query.Filtro.CodiceTipoMezzo[0]))
                {
                    generiMezzi = filtri.GeneriMezzi.Where(x => query.Filtro.CodiceTipoMezzo.Any(x.codice.Equals)).Select(x => x.Descrizione).ToArray();
                    composizioneMezzi = composizioneMezzi.Where(x => generiMezzi.Any(x.Mezzo.Genere.Equals)).ToList();
                }

                if (!string.IsNullOrEmpty(query.Filtro.CodiceMezzo))
                    composizioneMezzi = composizioneMezzi.Where(x => x.Mezzo.Codice == query.Filtro.CodiceMezzo).ToList();

                for (int i = 0; i < composizioneMezzi.Count; i++)
                {
                    if (query.Filtro.IdRichiesta.Length > 0 && !string.IsNullOrEmpty(query.Filtro.IdRichiesta))
                    {
                        ComposizioneMezzi composizione = composizioneMezzi[i];
                        composizione.IndiceOrdinamento =
                        _ordinamentoMezzi.GetIndiceOrdinamento(query.Filtro.IdRichiesta,
                        composizione, composizione.Mezzo.IdRichiesta);
                        composizione.Id = composizione.Mezzo.Codice;

                        if (composizione.IstanteScadenzaSelezione < DateTime.Now)
                        {
                            composizione.IstanteScadenzaSelezione = null;
                        }
                    }
                }

                var composizioneMezziPrenotati = GetComposizioneMezziPrenotati(composizioneMezzi, query.CodiceSede);

                return composizioneMezziPrenotati.OrderByDescending(x => x.IndiceOrdinamento).ToList();
            }
            else
            {
                foreach (var composizione in composizioneMezzi)
                {
                    composizione.IndiceOrdinamento = _ordinamentoMezzi.GetIndiceOrdinamento(query.Filtro.IdRichiesta, composizione, composizione.Mezzo.IdRichiesta);
                    composizione.Id = composizione.Mezzo.Codice;

                    if (composizione.IstanteScadenzaSelezione < DateTime.Now)
                    {
                        composizione.IstanteScadenzaSelezione = null;
                    }
                }

                var composizioneMezziPrenotati = GetComposizioneMezziPrenotati(composizioneMezzi, query.CodiceSede);

                return composizioneMezziPrenotati.OrderByDescending(x => x.IndiceOrdinamento).ToList();
            }
        }

        private List<ComposizioneMezzi> GetComposizioneMezziPrenotati(List<ComposizioneMezzi> composizioneMezzi, string codiceSede)
        {
            var mezziPrenotati = _getMezziPrenotati.Get(codiceSede);
            foreach (var composizione in composizioneMezzi)
            {
                if (mezziPrenotati.Find(x => x.CodiceMezzo.Equals(composizione.Mezzo.Codice)) != null)
                {
                    composizione.IstanteScadenzaSelezione = mezziPrenotati.Find(x => x.CodiceMezzo.Equals(composizione.Mezzo.Codice)).IstanteScadenzaSelezione;

                    if(composizione.Mezzo.Stato.Equals("In Sede"))
                    {
                        composizione.Mezzo.Stato = mezziPrenotati.Find(x => x.CodiceMezzo.Equals(composizione.Mezzo.Codice)).StatoOperativo;
                    }

                }
            }
            return composizioneMezzi;
        }

        private static List<ComposizioneMezzi> GeneraListaComposizioneMezzi(IEnumerable<Mezzo> listaMezzi)
        {
            var random = new Random();

            return (from mezzo in listaMezzi
                    let kmGen = random.Next(1, 60).ToString()
                    let tempoPer = Convert.ToDouble(kmGen.Replace(".", ",")) / 1.75
                    select new ComposizioneMezzi()
                    {
                        Id = mezzo.Codice,
                        Mezzo = mezzo,
                        Km = kmGen,
                        TempoPercorrenza = Math.Round(tempoPer, 2).ToString(CultureInfo.InvariantCulture),
                    }).ToList();
        }
    }
}
