using Microsoft.Extensions.Configuration;
using SO115App.API.Models.Classi.Condivise;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Gac;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using Newtonsoft.Json;
using SO115App.FakePersistence.JSon.Utility;
using System.IO;
using SO115App.ExternalAPI.Fake.Classi.DTOFake;
using SO115App.ExternalAPI.Fake.Classi.Gac;

namespace SO115App.ExternalAPI.Fake.GestioneMezzi
{
    public class GetMezziUtilizzabili : IGetMezziUtilizzabili

    {
        private readonly HttpClient _client;
        private readonly IConfiguration _configuration;
        private readonly IGetStatoMezzi _getStatoMezzi;

        public GetMezziUtilizzabili(HttpClient client, IConfiguration configuration, IGetStatoMezzi GetStatoMezzi)
        {
            _client = client;
            _configuration = configuration;
            _getStatoMezzi = GetStatoMezzi;
        }

        public async Task<List<Mezzo>> Get(List<string> sedi, string genereMezzo = null, string codiceMezzo = null)
        {
            var filepath = CostantiJson.ListaMezzi;
            string json;
            using (var r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            var listaMezziFake = JsonConvert.DeserializeObject<List<MezzoFake>>(json);

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

            var ListAnagraficaMezzo = new List<AnagraficaMezzo>();
            var ListaMezzi = new List<Mezzo>();
            foreach (string CodSede in ListaCodiciSedi)
            {
                var ListaMezziSede = listaMezziFake.FindAll(x => x.Sede.Contains(CodSede));
                foreach (MezzoFake m in ListaMezziSede)
                {
                    _client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("test");
                    var response = await _client.GetAsync($"{_configuration.GetSection("UrlExternalApi").GetSection("MezziApidipvvf").Value}?searchKey={m.Targa}").ConfigureAwait(false);
                    response.EnsureSuccessStatusCode();
                    using HttpContent content = response.Content;
                    var data = await content.ReadAsStringAsync().ConfigureAwait(false);
                    var aM = JsonConvert.DeserializeObject<AnagraficaMezzo>(data);
                    var mezzo = MapMezzo(aM, m);
                    ListaMezzi.Add(mezzo);
                }
            }

            return ListaMezzi;
        }

        private Mezzo MapMezzo(AnagraficaMezzo Am, MezzoFake Mf)
        {
            //List<Distaccamento> distaccamenti = _getListaDistaccamentiByCodiceSede.GetListaDistaccamenti(Am.Sede.Codice);
            //// ToDo _getListaDistaccamentiByCodiceSede.GetListaDistaccamenti da sostituire con la
            //// chiamata del servizio Igor
            //var d = distaccamenti.Find(x => x.CodDistaccamento.Equals(Am.Sede.Codice));
            //var sede = new Sede(Am.Sede.Codice, d.DescDistaccamento, d.Indirizzo, d.Coordinate, "", "", "", "", "");

            //ToDo inseire la chiamata al servizio per i dati del distaccamento
            var sede = new Sede("xxx", "xxxx", "", new Coordinate(1, 1), "", "", "", "", "");
            Mezzo mezzo = new Mezzo(Am.GenereMezzo.CodiceTipo + "." + Am.Targa,
                Am.Targa,
                Am.GenereMezzo.Codice,
                GetStatoOperativoMezzo(Am.Sede.Id, Am.GenereMezzo.CodiceTipo + "." + Am.Targa, Mf.Stato),
               Mf.CodDestinazione, sede, new Coordinate(1, 1))
            {
                DescrizioneAppartenenza = Mf.DescDestinazione,
            };

            return mezzo;
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
