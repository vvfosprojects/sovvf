using Google_API;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Composizione;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.ExternalAPI.Client;
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
        private readonly IConfiguration _configuration;
        private readonly IHttpRequestManager<DistanceMatrix> _clientMatrix;

        public OrdinamentoMezzi(IGetTipologieByCodice getTipologieByCodice, IConfiguration configuration, IHttpRequestManager<DistanceMatrix> clientMatrix)
        {
            _getTipologieByCodice = getTipologieByCodice;
            _configuration = configuration;
            _clientMatrix = clientMatrix;
        }

        public async Task<decimal> GetIndiceOrdinamento(RichiestaAssistenza Richiesta, ComposizioneMezzi composizione)
        {
            try
            {
                var comp = GetDistanceByGoogle(composizione, Richiesta);
                var ValoreAdeguatezzaMezzo = GeneraValoreAdeguatezzaMezzo(Richiesta.Tipologie, composizione.Mezzo.Genere);

                return 100 / (1 + Convert.ToDecimal(comp.Result.TempoPercorrenza.Replace(".", ",")) / 5400) + ValoreAdeguatezzaMezzo.Result;
            }
            catch (Exception) { return 0; }
        }

        private async Task<ComposizioneMezzi> GetDistanceByGoogle(ComposizioneMezzi composizione, RichiestaAssistenza richiesta)
        {
            string origine = $"origins={ composizione.Mezzo.Coordinate.Latitudine.ToString().Replace(",", ".")},{ composizione.Mezzo.Coordinate.Longitudine.ToString().Replace(",", ".")}";
            string destination = $"destinations={ richiesta.Localita.Coordinate.Latitudine.ToString().Replace(",", ".")},{ richiesta.Localita.Coordinate.Longitudine.ToString().Replace(",", ".")}";
            string mode = "mode=Driving";
            string sensor = "sensor=false";

            var url = new Uri(_configuration.GetSection("UrlExternalApi").GetSection("DistanceMatrix").Value + $"&{origine}&{destination}&{mode}&{sensor}");
            
            _clientMatrix.SetCache("Matrix_" + url.Query);

            var result = await _clientMatrix.PostAsync(url);

            if (result.Rows[0].Elements[0].Distance != null)
            {
                //LE Value sono espresse in SECONDI
                composizione.Km = result.Rows[0].Elements[0].Distance.Text.ToString().Substring(0, result.Rows[0].Elements[0].Distance.Text.ToString().Length - 2);
                composizione.TempoPercorrenza = (result.Rows[0].Elements[0].Duration.Value / 60).ToString();
            }
            else
            {
                composizione.Km = "0";
                composizione.TempoPercorrenza = "0";
            }

            return composizione;
        }

        private async Task<decimal> GeneraValoreAdeguatezzaMezzo(List<string> codiciTipologie, string genere)
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
