using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Composizione;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.ComposizioneSquadre;
using SO115App.FakePersistence.JSon.Utility;
using SO115App.FakePersistenceJSon.GestioneIntervento;
using SO115App.Models.Servizi.Infrastruttura.GetComposizioneSquadre;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Gac;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Squadre;

namespace SO115App.ExternalAPI.Fake.ImportOracle.SquadreMapper
{
    public class GetComposizioneSquadre : IGetComposizioneSquadre
    {
        private readonly IGetMezziUtilizzabili _getMezziUtilizzabili;
        private readonly IGetListaSquadre _getSquadre;

        public GetComposizioneSquadre(IGetMezziUtilizzabili getMezziUtilizzabili, IGetListaSquadre getSquadre)
        {
            _getMezziUtilizzabili = getMezziUtilizzabili;
            _getSquadre = getSquadre;
        }

        public List<ComposizioneSquadre> Get(ComposizioneSquadreQuery query)
        {
            List<string> ListaSedi = new List<string>();
            ListaSedi.Add(query.CodiceSede);
            var ListaMezzi = _getMezziUtilizzabili.Get(ListaSedi).Result;
            var ListaSquadre = _getSquadre.Get(ListaSedi).Result;

            var codiceDistaccamento = "";
            var composizioneSquadre = new List<ComposizioneSquadre>();

            foreach (Squadra s in ListaSquadre)
            {
                ComposizioneSquadre c = new ComposizioneSquadre();
                c.Squadra = s;
                c.Id = s.Id;
                composizioneSquadre.Add(c);
            }

            var pathFiltri = CostantiJson.Filtri;
            string jsonFiltri;
            using (var r = new StreamReader(pathFiltri))
            {
                jsonFiltri = r.ReadToEnd();
            }
            var filtri = JsonConvert.DeserializeObject<API.Models.Classi.Filtri.Filtri>(jsonFiltri);
            if ((query.Filtro.CodiceDistaccamento?.Length > 0 && !string.IsNullOrEmpty(query.Filtro.CodiceDistaccamento[0]))
                || (!string.IsNullOrEmpty(query.Filtro.CodiceMezzo) && !string.IsNullOrEmpty(query.Filtro.CodiceMezzo))
                 || ((query.Filtro.CodiceSquadra?.Length > 0) && !string.IsNullOrEmpty(query.Filtro.CodiceSquadra[0]))
                 || (query.Filtro.CodiceStatoMezzo?.Length > 0 && !string.IsNullOrEmpty(query.Filtro.CodiceStatoMezzo[0]))
                 || (query.Filtro.CodiceTipoMezzo?.Length > 0 && !string.IsNullOrEmpty(query.Filtro.CodiceTipoMezzo[0])))
            {
                if (!string.IsNullOrEmpty(query.Filtro.CodiceMezzo) && !string.IsNullOrEmpty(query.Filtro.CodiceMezzo))
                {
                    var mezzo = ListaMezzi.Find(x => x.Codice == query.Filtro.CodiceMezzo);

                    if (mezzo != null)
                    {
                        if (query.Filtro.CodiceDistaccamento.Count() > 0 && !string.IsNullOrEmpty(query.Filtro.CodiceDistaccamento[0]))
                        {
                            if (mezzo != null && !query.Filtro.CodiceDistaccamento.Any(mezzo.Distaccamento.Codice.Equals))
                            {
                                mezzo = null;
                                composizioneSquadre = null;
                            }
                        }

                        if (mezzo != null)
                        {
                            codiceDistaccamento = mezzo.Distaccamento.Codice;

                            if (mezzo.IdRichiesta != null)
                            {
                                var getRichiesta = new GetRichiestaById();
                                var richiesta = getRichiesta.GetByCodice(mezzo.IdRichiesta);
                                var listaSquadre = richiesta.Partenze
                                    .Where(x => x.Partenza.Mezzo.Codice.Equals(mezzo.Codice))
                                    .Select(x => x.Partenza.Squadre);
                                composizioneSquadre = composizioneSquadre.Where(x => listaSquadre.Any(x.Squadra.Equals))
                                    .ToList();
                            }
                            else
                            {
                                composizioneSquadre = composizioneSquadre
                                   .Where(x => x.Squadra.Distaccamento.Codice == codiceDistaccamento).ToList();
                            }
                        }
                    }
                }
                if (query.Filtro.CodiceDistaccamento?.Length > 0 && !string.IsNullOrEmpty(query.Filtro.CodiceDistaccamento[0]))
                    composizioneSquadre = composizioneSquadre.Where(x => (query.Filtro.CodiceDistaccamento.Any(x.Squadra.Distaccamento.Codice.Equals))).ToList();

                return composizioneSquadre;
            }

            return composizioneSquadre;
        }
    }
}
