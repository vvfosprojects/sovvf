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
using SO115App.Models.Classi.Utility;

namespace SO115App.ExternalAPI.Fake.GestioneMezzi
{
    public class GetMezziUtilizzabili : IGetMezziUtilizzabili

    {
        private readonly HttpClient _client;
        private readonly IConfiguration _configuration;
        private readonly IGetStatoMezzi _getStatoMezzi;
        private readonly IGetDistaccamentoByCodiceSedeUC _getDistaccamentoByCodiceSedeUC;
        private readonly IGetListaDistaccamentiByCodiceSede _getListaDistaccamentiByCodiceSede;

        public GetMezziUtilizzabili(HttpClient client, IConfiguration configuration, IGetStatoMezzi GetStatoMezzi,
            IGetDistaccamentoByCodiceSedeUC GetDistaccamentoByCodiceSedeUC,
            IGetListaDistaccamentiByCodiceSede GetListaDistaccamentiByCodiceSede)
        {
            _client = client;
            _configuration = configuration;
            _getStatoMezzi = GetStatoMezzi;
            _getDistaccamentoByCodiceSedeUC = GetDistaccamentoByCodiceSedeUC;
            _getListaDistaccamentiByCodiceSede = GetListaDistaccamentiByCodiceSede;
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
                foreach (MezzoFake mezzoFake in ListaMezziSede)
                {
                    _client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("test");
                    var response = await _client.GetAsync($"{_configuration.GetSection("UrlExternalApi").GetSection("MezziApidipvvf").Value}?searchKey={mezzoFake.Targa}").ConfigureAwait(false);
                    response.EnsureSuccessStatusCode();
                    using HttpContent content = response.Content;
                    var data = await content.ReadAsStringAsync().ConfigureAwait(false);

                    var listaAnagraficaMezzo = new List<AnagraficaMezzo>();
                    listaAnagraficaMezzo = JsonConvert.DeserializeObject<List<AnagraficaMezzo>>(data);
                    var anagraficaMezzo = listaAnagraficaMezzo.Find(x => x.Targa.Equals(mezzoFake.Targa));

                    var mezzo = MapMezzo(anagraficaMezzo, mezzoFake);
                    ListaMezzi.Add(mezzo);
                }
            }

            return ListaMezzi;
        }

        private Mezzo MapMezzo(AnagraficaMezzo anagraficaMezzo, MezzoFake mezzoFake)
        {
            List<Distaccamento> distaccamenti = _getListaDistaccamentiByCodiceSede.GetListaDistaccamenti(anagraficaMezzo.Sede.Codice);
            var distaccamentoPerCoordinate = distaccamenti.Find(x => x.CodDistaccamento.Equals(anagraficaMezzo.Sede.CodDistaccamento));

            var distaccamento = new Distaccamento();
            distaccamento = _getDistaccamentoByCodiceSedeUC.Get(mezzoFake.Sede).Result;
            var sede = new Sede(mezzoFake.Sede, distaccamento.DescDistaccamento, distaccamento.Indirizzo, new Coordinate(1, 1), "", "", "", "", "");

            Mezzo mezzo = new Mezzo(anagraficaMezzo.GenereMezzo.CodiceTipo + "." + anagraficaMezzo.Targa,
                anagraficaMezzo.Targa,
                anagraficaMezzo.GenereMezzo.Codice,
                GetStatoOperativoMezzo(anagraficaMezzo.Sede.Id, anagraficaMezzo.GenereMezzo.CodiceTipo + "." + anagraficaMezzo.Targa, mezzoFake.Stato),
               mezzoFake.CodDestinazione, sede, new Coordinate(1, 1))
            {
                DescrizioneAppartenenza = mezzoFake.DescDestinazione,
            };

            return mezzo;
        }

        private string GetStatoOperativoMezzo(string codiceSedeDistaccamento, string codiceMezzo, string StatoMezzoOra)
        {
            string stato;
            if (StatoMezzoOra.Equals("I"))
            {
                stato = Costanti.MezzoSulPosto;
            }
            else
            {
                var ListaStatoOperativoMezzo = _getStatoMezzi.Get(codiceSedeDistaccamento, codiceMezzo);
                if (ListaStatoOperativoMezzo.Count == 0)
                {
                    switch (StatoMezzoOra)
                    {
                        case "D": stato = Costanti.MezzoInSede; break;
                        case "R": stato = Costanti.MezzoInRientro; break;
                        case "O": stato = Costanti.MezzoOperativoPreaccoppiato; break;
                        case "A": stato = Costanti.MezzoAssegnatoPreaccoppiato; break;
                        default: stato = Costanti.MezzoStatoSconosciuto; break;
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
