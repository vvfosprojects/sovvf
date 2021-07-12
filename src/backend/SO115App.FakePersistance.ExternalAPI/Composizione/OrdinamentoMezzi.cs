using Google_API;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Composizione;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.GestioneTipologie;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.Composizione
{
    public class OrdinamentoMezzi
    {
        private readonly IGetTipologieByCodice _getTipologieByCodice;
        private readonly HttpClient _client;
        private readonly IConfiguration _configuration;

        public OrdinamentoMezzi(IGetTipologieByCodice getTipologieByCodice, IConfiguration configuration)
        {
            _getTipologieByCodice = getTipologieByCodice;
            _client = new HttpClient();
            _configuration = configuration;
        }

        public async Task<decimal> GetIndiceOrdinamento(RichiestaAssistenza Richiesta, ComposizioneMezzi composizione)
        {
            int ValoreIntOriginePerSganciamento = 0;
            decimal ValoreAdeguatezzaMezzo;

            var comp = GetDistanceByGoogle(composizione, Richiesta);

            ValoreAdeguatezzaMezzo = GeneraValoreAdeguatezzaMezzo(Richiesta.Tipologie, composizione.Mezzo.Genere);

            return 100 / (1 + Convert.ToDecimal(comp.Result.TempoPercorrenza.Replace(".", ",")) / 5400) + ValoreIntOriginePerSganciamento + ValoreAdeguatezzaMezzo;
        }

        private async Task<ComposizioneMezzi> GetDistanceByGoogle(ComposizioneMezzi composizione, RichiestaAssistenza richiesta)
        {
            var origine = $"origins={ composizione.Mezzo.Coordinate.Latitudine.ToString().Replace(",", ".")},{ composizione.Mezzo.Coordinate.Longitudine.ToString().Replace(",", ".")}";
            var destination = $"destinations={ richiesta.Localita.Coordinate.Latitudine.ToString().Replace(",", ".")},{ richiesta.Localita.Coordinate.Longitudine.ToString().Replace(",", ".")}";
            var mode = "mode=Driving";
            var sensor = "sensor=false";

            StringContent queryString = new StringContent("");

            var response = await _client.PostAsync(_configuration.GetSection("UrlExternalApi").GetSection("DistanceMatrix").Value + $"&{origine}&{destination}&{mode}&{sensor}", queryString).ConfigureAwait(false);
            response.EnsureSuccessStatusCode();
            using HttpContent content = response.Content;
            string data = await content.ReadAsStringAsync().ConfigureAwait(false);
            var distanza = JsonConvert.DeserializeObject<DistanceMatrix>(data);

            if (distanza.Rows[0].Elements[0].Distance != null)
            {
                //LE Value sono espresse in SECONDI
                composizione.Km = distanza.Rows[0].Elements[0].Distance.Text.ToString().Substring(0, distanza.Rows[0].Elements[0].Distance.Text.ToString().Length - 2);
                composizione.TempoPercorrenza = (distanza.Rows[0].Elements[0].Duration.Value / 60).ToString();
            }
            else
            {
                composizione.Km = "100";
                composizione.TempoPercorrenza = "50";
            }

            return composizione;
        }

        private decimal GeneraValoreAdeguatezzaMezzo(List<string> codiciTipologie, string genere)
        {
            var tipologie = _getTipologieByCodice.Get(codiciTipologie);

            if(tipologie != null) foreach (var tipologia in tipologie)
            {
                if (tipologia != null)
                {
                    return genere switch
                    {
                        "APS" => Convert.ToDecimal(tipologia.AdeguatezzaMezzo.Aps),
                        "AS" => Convert.ToDecimal(tipologia.AdeguatezzaMezzo.As),
                        "AB" => Convert.ToDecimal(tipologia.AdeguatezzaMezzo.Ab),
                        "AV" => Convert.ToDecimal(tipologia.AdeguatezzaMezzo.Av),
                        "AG" => Convert.ToDecimal(tipologia.AdeguatezzaMezzo.Ag),
                        _ => Convert.ToDecimal(tipologia.AdeguatezzaMezzo.Default),
                    };
                }
            }
            return 10;
        }
    }
}
