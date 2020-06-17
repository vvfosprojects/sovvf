using Google_API;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Composizione;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.GestioneTipologie;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.Composizione
{
    public class OrdinamentoMezzi
    {
        private readonly IGetRichiestaById _getRichiestaById;
        private readonly IGetTipologieByCodice _getTipologieByCodice;
        private readonly HttpClient _client;
        private readonly IConfiguration _configuration;

        public OrdinamentoMezzi(IGetRichiestaById getRichiestaById, IGetTipologieByCodice getTipologieByCodice, HttpClient client, IConfiguration configuration)
        {
            _getRichiestaById = getRichiestaById;
            _getTipologieByCodice = getTipologieByCodice;
            this._client = client;
            this._configuration = configuration;
        }

        public decimal GetIndiceOrdinamento(string IdRichiesta, ComposizioneMezzi composizione, bool CoordinateFake, string IdRichiestaOrigine = null)
        {
            int ValoreIntOriginePerSganciamento = 0;
            decimal ValoreAdeguatezzaMezzo;

            var richiestaDestinazione = _getRichiestaById.GetById(IdRichiesta);

            if (IdRichiestaOrigine != null)
            {
                var richiestaOrigine = _getRichiestaById.GetByCodice(IdRichiestaOrigine);
                ValoreIntOriginePerSganciamento = -200; // Hard Coded perchè le tipologie verranno prese da un servizio Esterno e questo valore è sempre uguale
            }

            ValoreAdeguatezzaMezzo = GeneraValoreAdeguatezzaMezzo(richiestaDestinazione.Tipologie, composizione.Mezzo.Genere);

            if (!CoordinateFake)
                composizione = GetDistanceByGoogle(composizione, richiestaDestinazione).Result;

            return 100 / (1 + Convert.ToDecimal(composizione.TempoPercorrenza.Replace(".", ",")) / 5400) + ValoreIntOriginePerSganciamento + ValoreAdeguatezzaMezzo;
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
            foreach (var tipologia in _getTipologieByCodice.Get(codiciTipologie))
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
