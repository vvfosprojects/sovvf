using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using SO115App.ExternalAPI.Fake.Classi.DTOOracle;
using SO115App.Models.Classi.NUE;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.ImportOracle.SchedeContatto
{
    public class GetSchedeContatto : IGetSchedeContatto
    {
        private readonly HttpClient _client;
        private readonly IConfiguration _configuration;

        public GetSchedeContatto(HttpClient client, IConfiguration configuration)
        {
            _client = client;
            _configuration = configuration;
        }

        public List<SchedaContatto> ListaSchedeContatto(string CodSede)
        {
            List<SchedaContatto> listaSchede = new List<SchedaContatto>();

            listaSchede = GetListaSchedeDaOra(CodSede).Result;

            return listaSchede;
        }

        private async Task<List<SchedaContatto>> GetListaSchedeDaOra(string codSede)
        {
            _client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("test");
            var response = await _client.GetAsync($"{_configuration.GetSection("OracleImplementation").GetSection(codSede).GetSection("UrlAPISchedeContatto").Value}GetSchedeContatto?CodSede={codSede}").ConfigureAwait(false);
            response.EnsureSuccessStatusCode();
            using HttpContent content = response.Content;
            string data = await content.ReadAsStringAsync().ConfigureAwait(false);
            var ListaSchedeOracle = JsonConvert.DeserializeObject<List<ORASchedaContatto>>(data);

            var ListaSchede = MapListaSchedeFromOracle(ListaSchedeOracle);

            return ListaSchede;
        }

        private List<SchedaContatto> MapListaSchedeFromOracle(List<ORASchedaContatto> listaSchedeOracle)
        {
            List<SchedaContatto> ListaSchede = new List<SchedaContatto>();

            foreach (var scheda in listaSchedeOracle)
            {
                var ClassificazioneEvento = scheda.NOTE_AREU.Substring(0, scheda.NOTE_AREU.IndexOf("Categoria:") - 1);
                var Categoria = scheda.NOTE_AREU.Substring(scheda.NOTE_AREU.IndexOf("Categoria:") + 1, scheda.NOTE_AREU.IndexOf("Priorità:") - 1);
                var Priorita = scheda.NOTE_AREU.Substring(scheda.NOTE_AREU.IndexOf("Priorità:") + 1, scheda.NOTE_AREU.Length);

                SchedaContatto schedaCon = new SchedaContatto()
                {
                    CodiceScheda = scheda.ID_CONTATTO.ToString(),
                    DataInserimento = scheda.DATA_INS,
                    Richiedente = new API.Models.Classi.Condivise.Richiedente(scheda.COGNOME + " " + scheda.NOME, scheda.TEL_PUBL),
                    Localita = new API.Models.Classi.Condivise.Localita(new API.Models.Classi.Condivise.Coordinate(Convert.ToDouble(scheda.LAT), Convert.ToDouble(scheda.LON)), scheda.INDIRIZZO + " " + scheda.CIVICO, scheda.NOTE_INTERVENTO)
                    {
                        Citta = scheda.CITTA,
                        Provincia = scheda.PROVINCIA
                    },
                    Classificazione = scheda.COMPETENZA == "VVF" ? "Competenza" : scheda.DIFFERIBILE == "VVF" ? "Differibile" : "Conoscenza",
                    ClassificazioneEvento = ClassificazioneEvento.Trim(),
                    Categoria = Categoria.Trim(),
                    Priorita = Priorita.Trim().Equals("ALTA") ? 1 : Priorita.Trim().Equals("MEDIA") ? 2 : 3,
                    Dettaglio = "",
                    Gestita = scheda.FLG_GESTITA.Equals("S") ? true : false
                };

                ListaSchede.Add(schedaCon);
            }

            return ListaSchede;
        }
    }
}
