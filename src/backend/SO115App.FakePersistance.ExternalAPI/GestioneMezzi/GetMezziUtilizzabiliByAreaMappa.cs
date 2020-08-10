using Microsoft.Extensions.Configuration;
using SO115App.API.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Gac;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using Newtonsoft.Json;
using SO115App.ExternalAPI.Fake.Classi.Gac;
using SO115App.Models.Servizi.Infrastruttura.GeoFleet;

using SO115App.API.Models.Classi.Geo;
using SO115App.Models.Classi.ServiziEsterni;
using System;

namespace SO115App.ExternalAPI.Fake.GestioneMezzi
{
    public class GetMezziUtilizzabiliByAreaMappa : IGetMezziUtilizzabiliByAreaMappa

    {
        private readonly HttpClient _client;
        private readonly IConfiguration _configuration;
        private readonly IGetStatoMezzi _getStatoMezzi;
        private readonly IGetDistaccamentoByCodiceSedeUC _getDistaccamentoByCodiceSedeUC;
        private readonly IGetPosizioneFlotta _getPosizioneFlotta;

        public GetMezziUtilizzabiliByAreaMappa(HttpClient client, IConfiguration configuration, IGetStatoMezzi GetStatoMezzi,
            IGetDistaccamentoByCodiceSedeUC GetDistaccamentoByCodiceSedeUC, IGetPosizioneFlotta getPosizioneFlotta)
        {
            _client = client;
            _configuration = configuration;
            _getStatoMezzi = GetStatoMezzi;
            _getDistaccamentoByCodiceSedeUC = GetDistaccamentoByCodiceSedeUC;
            _getPosizioneFlotta = getPosizioneFlotta;
        }

        public async Task<List<Mezzo>> Get(AreaMappa areaMappa)
        {
            var ListaAnagraficaMezzo = new List<AnagraficaMezzo>();
            var ListaPosizioneFlotta = _getPosizioneFlotta.Get(0).Result;
            var ListaMezziInRettangolo = new List<MessaggioPosizione>();

            ListaMezziInRettangolo.AddRange(ListaPosizioneFlotta.Where(mezzo => mezzo.Localizzazione.Lat >= areaMappa.BottomLeft.Latitudine && mezzo.Localizzazione.Lat <= areaMappa.TopRight.Latitudine && mezzo.Localizzazione.Lon >= areaMappa.BottomLeft.Longitudine && mezzo.Localizzazione.Lon <= areaMappa.TopRight.Longitudine));

            List<Mezzo> ListaMezziAreaMappa = GetAnagraficaMezziByTarga(ListaMezziInRettangolo).Result;

            return GetListaMezziConStatoAggiornat(ListaMezziAreaMappa);
        }

        private async Task<List<Mezzo>> GetAnagraficaMezziByTarga(List<MessaggioPosizione> listaMezziInRettangolo)
        {
            try
            {
                List<Mezzo> ListaMezzi = new List<Mezzo>();
                foreach (var mezzo in listaMezziInRettangolo)
                {
                    _client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("test");

                    var targaMezzo = mezzo.CodiceMezzo.Contains(".") ? mezzo.CodiceMezzo.Split('.')[1] : mezzo.CodiceMezzo;
                    var response = await _client.GetAsync($"{_configuration.GetSection("UrlExternalApi").GetSection("MezziApidipvvf").Value}?searchKey={targaMezzo}").ConfigureAwait(false);
                    response.EnsureSuccessStatusCode();
                    using HttpContent contentMezzo = response.Content;
                    var data = await contentMezzo.ReadAsStringAsync().ConfigureAwait(false);

                    var ListaAnagrafiche = JsonConvert.DeserializeObject<List<AnagraficaMezzo>>(data);

                    Coordinate coordinate = new Coordinate(mezzo.Localizzazione.Lat, mezzo.Localizzazione.Lon);

                    foreach (var anagrafica in ListaAnagrafiche)
                    {
                        var sede = _getDistaccamentoByCodiceSedeUC.Get(anagrafica.Sede.Id).Result;
                        Sede InfoSede = new Sede(sede.CodSede, sede.DescDistaccamento, sede.Indirizzo, sede.Coordinate, "", "", "", "", "");

                        Mezzo Infomezzo = new Mezzo(anagrafica.GenereMezzo.CodiceTipo + "." + anagrafica.Targa,
                                            anagrafica.Targa,
                                            anagrafica.GenereMezzo.Codice,
                                            "", "", InfoSede, coordinate)
                        {
                            DescrizioneAppartenenza = sede.DescDistaccamento
                        };

                        ListaMezzi.Add(Infomezzo);
                    }
                }

                return ListaMezzi;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        private List<Mezzo> GetListaMezziConStatoAggiornat(List<Mezzo> listaMezzi)
        {
            foreach (Mezzo mezzo in listaMezzi)
            {
                var ListaStatoOperativoMezzo = _getStatoMezzi.Get(mezzo.Distaccamento.Codice, mezzo.Codice);
                if (ListaStatoOperativoMezzo.Count > 0)
                {
                    mezzo.Stato = ListaStatoOperativoMezzo.Find(x => x.CodiceMezzo.Equals(mezzo.Codice)).StatoOperativo;
                }
                else
                {
                    mezzo.Stato = "In sede";
                }
            }

            return listaMezzi;
        }
    }
}
