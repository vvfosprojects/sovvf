﻿using Microsoft.Extensions.Configuration;
using SO115App.API.Models.Classi.Condivise;
using SO115App.Models.Classi.ServiziEsterni.Utility;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Gac;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using Newtonsoft.Json;
using SO115App.Models.Classi.ServiziEsterni.Oracle;
using SO115App.ExternalAPI.Fake.Classi.Gac;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.GeoFleet;
using SO115App.Models.Classi.ServiziEsterni;
using SO115App.Models.Classi.ServiziEsterni.Gac;

namespace SO115App.ExternalAPI.Fake.ImportOracle.MezziMapper
{
    public class GetMezziUtilizzabili : IGetMezziUtilizzabili

    {
        private readonly HttpClient _client;
        private readonly IConfiguration _configuration;
        private readonly IGetDistaccamentoByCodiceSedeUC _getDistaccamentoByCodiceSedeUC;
        private readonly IGetStatoMezzi _getStatoMezzi;
        private readonly IGetPosizioneByCodiceMezzo _getPosizioneByCodiceMezzo;

        public GetMezziUtilizzabili(HttpClient client, IConfiguration configuration,
             IGetDistaccamentoByCodiceSedeUC GetDistaccamentoByCodiceSedeUC,
            IGetStatoMezzi GetStatoMezzi, IGetPosizioneByCodiceMezzo getPosizioneByCodiceMezzo)
        {
            _client = client;
            _configuration = configuration;
            _getDistaccamentoByCodiceSedeUC = GetDistaccamentoByCodiceSedeUC;
            _getStatoMezzi = GetStatoMezzi;
            _getPosizioneByCodiceMezzo = getPosizioneByCodiceMezzo;
        }

        public async Task<List<Mezzo>> Get(List<string> sedi, string genereMezzo = null, string codiceMezzo = null, List<MessaggioPosizione> posizioneFlotta = null)
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
                var anagraficaMezzo = GetAnagraficaMezzo(OraM.TARGA).Result;

                var distaccamento = new Distaccamento();
                var coordinate = new Coordinate(0, 0);
                distaccamento = _getDistaccamentoByCodiceSedeUC.Get(OraM.COD_COMANDO + "." + OraM.COD_DISTACCAMENTO).Result;

                var sede = new Sede(OraM.COD_COMANDO + "." + OraM.COD_DISTACCAMENTO, distaccamento.DescDistaccamento, distaccamento.Indirizzo, distaccamento.Coordinate, "", "", "", "", "");
                var coordinateMezzo = _getPosizioneByCodiceMezzo.Get(anagraficaMezzo.GenereMezzo.CodiceTipo + "." + anagraficaMezzo.Targa).Result;
                if (coordinateMezzo != null)
                {
                    coordinate = new Coordinate(coordinateMezzo.Localizzazione.Lat, coordinateMezzo.Localizzazione.Lon);
                }
                else
                {
                    coordinate = new Coordinate(sede.Coordinate.Latitudine, sede.Coordinate.Longitudine);
                }

                Mezzo mezzo = new Mezzo(anagraficaMezzo.GenereMezzo.CodiceTipo + "." + anagraficaMezzo.Targa,
                    anagraficaMezzo.Targa,
                    anagraficaMezzo.GenereMezzo.CodiceTipo,
                    GetStatoOperativoMezzo(anagraficaMezzo.Sede.Id, anagraficaMezzo.GenereMezzo.CodiceTipo + "." + anagraficaMezzo.Targa, OraM.STATO),
                    OraM.COD_DESTINAZIONE,
                    sede,
                    coordinate)
                {
                    DescrizioneAppartenenza = OraM.COD_DESTINAZIONE,
                };

                ListaMezzi.Add(mezzo);
            }

            return ListaMezzi;
        }

        private async Task<AnagraficaMezzo> GetAnagraficaMezzo(string targaMezzo)
        {
            _client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("test");
            var response = await _client.GetAsync($"{_configuration.GetSection("UrlExternalApi").GetSection("MezziApidipvvf").Value}?searchKey={targaMezzo}").ConfigureAwait(false);
            response.EnsureSuccessStatusCode();
            using HttpContent content = response.Content;
            var data = await content.ReadAsStringAsync().ConfigureAwait(false);

            var listaAnagraficaMezzo = new List<AnagraficaMezzo>();
            listaAnagraficaMezzo = JsonConvert.DeserializeObject<List<AnagraficaMezzo>>(data);

            var anagraficaMezzo = listaAnagraficaMezzo.Find(x => x.Targa.Equals(targaMezzo));

            return anagraficaMezzo;
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
