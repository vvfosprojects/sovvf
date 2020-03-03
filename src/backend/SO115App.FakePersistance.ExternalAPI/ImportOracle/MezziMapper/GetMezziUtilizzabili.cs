using Microsoft.Extensions.Configuration;
using SO115App.API.Models.Classi.Condivise;
using SO115App.ExternalAPI.Fake.Classi.DTOOracle;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Gac;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Mezzi;
using SO115App.ExternalAPI.Fake.ImportOracle.DistaccamentiMapper;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using Newtonsoft.Json;

namespace SO115App.ExternalAPI.Fake.ImportOracle.MezziMapper
{
    public class GetMezziUtilizzabili : IGetMezziUtilizzabili

    {
        private readonly HttpClient _client;
        private readonly IConfiguration _configuration;
        private readonly IGetListaDistaccamentiByCodiceSede _getListaDistaccamentiByCodiceSede;
        private readonly IGetStatoMezzi _getStatoMezzi;

        public GetMezziUtilizzabili(HttpClient client, IConfiguration configuration, IGetListaDistaccamentiByCodiceSede GetListaDistaccamentiByCodiceSede, IGetStatoMezzi GetStatoMezzi)
        {
            _client = client;
            _configuration = configuration;
            _getListaDistaccamentiByCodiceSede = GetListaDistaccamentiByCodiceSede;
            _getStatoMezzi = GetStatoMezzi;
        }

        public async Task<List<Mezzo>> Get(List<string> sedi, string genereMezzo = null, string codiceMezzo = null)
        {
            var ListaMezzi = new List<Mezzo>();
            var ListaCodiciSedi = new List<string>();
            foreach (string sede in sedi)
            {
                var codice = sede.Substring(0, 2);
                string codiceE = "";
                codiceE = ListaCodiciSedi.Find(x => x.Equals(codice));
                if (string.IsNullOrEmpty(codiceE))
                {
                    ListaCodiciSedi.Add(codice);
                }
            }

            foreach (string CodSede in ListaCodiciSedi)
            {
                _client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("test");
                var response = await _client.GetAsync($"{_configuration.GetSection("OracleImplementation").GetSection(CodSede).GetSection("UrlAPIMezzi").Value}/GetListaMezziUtilizzabili?CodSede={CodSede}").ConfigureAwait(false);
                response.EnsureSuccessStatusCode();
                using HttpContent content = response.Content;
                var data = await content.ReadAsStringAsync().ConfigureAwait(false);
                var ListaMezziOracle = JsonConvert.DeserializeObject<List<ORAAutomezzi>>(data);
                List<Mezzo> ListaMezziCodiceSede = MapListaMezziOraInMongoDB(ListaMezziOracle);

                foreach (Mezzo Mezzo in ListaMezziCodiceSede)
                {
                    ListaMezzi.Add(Mezzo);
                }
            }

            return ListaMezzi;
        }

        private List<Mezzo> MapListaMezziOraInMongoDB(List<ORAAutomezzi> ListaMezziOracle)
        {
            List<Mezzo> ListaMezzi = new List<Mezzo>();
            foreach (ORAAutomezzi OraM in ListaMezziOracle)
            {
                List<Distaccamento> distaccamenti = _getListaDistaccamentiByCodiceSede.GetListaDistaccamenti(OraM.COD_COMANDO);
                var d = distaccamenti.Find(x => x.CodDistaccamento.Equals(OraM.COD_DISTACCAMENTO));

                var sede = new Sede(OraM.COD_COMANDO + "." + OraM.COD_DISTACCAMENTO, d.DescDistaccamento, d.Indirizzo, d.Coordinate, "", "", "", "", "");

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
