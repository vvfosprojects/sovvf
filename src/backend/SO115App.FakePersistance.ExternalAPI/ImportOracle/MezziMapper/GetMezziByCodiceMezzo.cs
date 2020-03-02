using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Condivise;
using SO115App.ExternalAPI.Fake.Classi.DTOOracle;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Gac;
using System.Collections.Generic;
using System.Net.Http;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using System.Linq;

namespace SO115App.ExternalAPI.Fake.ImportOracle.MezziMapper
{
    public class GetMezziByCodiceMezzo : IGetMezziByCodiceMezzo
    {
        private readonly HttpClient _client;
        private readonly IConfiguration _configuration;
        private readonly IGetListaDistaccamentiByCodiceSede _getListaDistaccamentiByCodiceSede;
        private readonly IGetStatoMezzi _getStatoMezzi;

        public GetMezziByCodiceMezzo(HttpClient client, IConfiguration configuration, IGetListaDistaccamentiByCodiceSede GetListaDistaccamentiByCodiceSede, IGetStatoMezzi GetStatoMezzi)
        {
            _client = client;
            _configuration = configuration;
            _getListaDistaccamentiByCodiceSede = GetListaDistaccamentiByCodiceSede;
            _getStatoMezzi = GetStatoMezzi;
        }

        public List<Mezzo> Get(List<string> codiceMezzo, string codSede)
        {
            _client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("test");
            var response = _client.GetAsync($"{_configuration.GetSection("OracleImplementation").GetSection(codSede.Substring(0, 2)).GetSection("UrlAPIMezzi").Value}/GetListaMezziUtilizzabili?CodSede={codSede.Substring(0, 2)}").ConfigureAwait(false);
            List<ORAAutomezzi> ListaMezziOracle = JsonConvert.DeserializeObject<List<ORAAutomezzi>>(response.ToString());

            return MapListaMezziOraInMongoDB(ListaMezziOracle, codiceMezzo);
        }

        private List<Mezzo> MapListaMezziOraInMongoDB(List<ORAAutomezzi> ListaMezziOracle, List<string> codiceMezzo)
        {
            List<Mezzo> ListaMezzi = new List<Mezzo>();

            foreach (var codice in codiceMezzo)
            {
                var OraM = ListaMezziOracle.Find(x => x.COD_AUTOMEZZO.Equals(codice));

                List<Distaccamento> distaccamenti = _getListaDistaccamentiByCodiceSede.GetListaDistaccamenti(OraM.COD_COMANDO);
                var d = distaccamenti.Find(x => x.CodDistaccamento.Equals(OraM.COD_DISTACCAMENTO));

                var sede = new Sede(OraM.COD_COMANDO + "." + OraM.COD_DISTACCAMENTO, d.DescDistaccamento, d.Indirizzo, new Coordinate(1, 1), "", "", "", "", "");

                Mezzo mezzo = new Mezzo(OraM.TIPO_MEZZO + "." + OraM.TARGA,
                    OraM.TARGA,
                    OraM.COD_GENERE_MEZZO,
                    GetStatoOperativoMezzo(OraM.COD_COMANDO + "." + OraM.COD_DISTACCAMENTO,
                                           OraM.TIPO_MEZZO + "." + OraM.TARGA, OraM.STATO),
                    OraM.COD_DESTINAZIONE,
                    sede,
                    new Coordinate(1, 1))

                {
                    DescrizioneAppartenenza = OraM.COD_DESTINAZIONE,
                };

                ListaMezzi.Add(mezzo);
            }

            return ListaMezzi;
        }

        private string GetStatoOperativoMezzo(string codiceSedeDistaccamento, string codiceMezzo, string StatoMezzoOra)
        {
            string stato;
            if (StatoMezzoOra.Equals("I"))
            {
                stato = "Sul Posto";
            }
            else
            {
                var ListaStatoOperativoMezzo = _getStatoMezzi.Get(codiceSedeDistaccamento, codiceMezzo);
                if (ListaStatoOperativoMezzo.Count == 0)
                {
                    switch (StatoMezzoOra)
                    {
                        case "D": stato = "In Sede"; break;
                        case "R": stato = "In Rientro"; break;
                        default: stato = "Sconosciuto"; break;
                    }
                }
                else
                {
                    stato = ListaStatoOperativoMezzo.Find(x => x.CodiceMezzo.Equals(codiceMezzo)).StatoOperativo;
                }
            }
            return stato;
        }
    }
}
