using Google_API;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Composizione;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.ExternalAPI.Fake.Classi;
using SO115App.Models.Classi.ESRI;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.GestioneTipologie;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ESRI;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Mezzi;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.Composizione
{
    public class OrdinamentoMezzi : IOrdinamentoMezzi
    {
        private readonly IGetTipologieByCodice _getTipologieByCodice;
        private readonly IGetDistanzaTempoMezzi _getDistanzaTempoMezzi;
        private readonly HttpClient _client;
        private readonly IConfiguration _configuration;

        public OrdinamentoMezzi(IGetTipologieByCodice getTipologieByCodice, IGetDistanzaTempoMezzi getDistanzaTempoMezzi, HttpClient client, IConfiguration configuration)
        {
            _getTipologieByCodice = getTipologieByCodice;
            _getDistanzaTempoMezzi = getDistanzaTempoMezzi;
            _client = client;
            _configuration = configuration;
        }

        public async Task<List<ComposizioneMezzi>> GetIndiceOrdinamento(RichiestaAssistenza Richiesta, List<ComposizioneMezzi> composizioni)
        {
            return GetIndiceOrdinamentoFunc(Richiesta, composizioni).ToList();
        }

        private IEnumerable<ComposizioneMezzi> GetIndiceOrdinamentoFunc(RichiestaAssistenza Richiesta, List<ComposizioneMezzi> composizioni)
        {
            //var lstMezziEsri = composizioni.Select(c => new ESRI_Mezzo()
            //{
            //    codice = c.Mezzo.Codice,
            //    coordinate = string.Join(", ", c.Mezzo?.CoordinateStrg ?? new string[] { "0", "0" }),
            //    track = !c.Mezzo.Genere.Equals("AV"),
            //}).ToList();

            //var distanzaTempo = _getDistanzaTempoMezzi.Get(new ESRI_DistanzaTempoMezzi()
            //{
            //    coordinateIntervento = string.Join(", ", Richiesta.Localita.CoordinateString ?? new string[] { "0", "0" }),
            //    mezzi = lstMezziEsri
            //});

            var listaComposizioni = new List<ComposizioneMezzi>();
            Parallel.ForEach(composizioni, composizione =>
            {
                decimal result = 0.0m;

                try
                {
                    //var GoogleRes = GetDistanceByGoogle(composizione, Richiesta);

                    //var tempodist = distanzaTempo.Result.Find(m => m.codice.Equals(composizione.Mezzo.Codice));

                    var ValoreAdeguatezzaMezzo = GeneraValoreAdeguatezzaMezzo(Richiesta.Tipologie.Select(c => c.Codice).ToList(), composizione.Mezzo.Genere);

                    //result = 100 / (1 + Convert.ToDecimal(composizione.TempoPercorrenza.Replace(".", ",")) / 5400) + ValoreAdeguatezzaMezzo.Result;
                    result = 100 + ValoreAdeguatezzaMezzo.Result;
                    composizione.Km = "0"; //tempodist.distanza.ToString();
                    composizione.TempoPercorrenza = "0"; //tempodist.tempo.ToString();
                    composizione.IndiceOrdinamento = result;
                }
                catch (Exception) { }

                listaComposizioni.Add(composizione);
            });

            return listaComposizioni;

            //foreach (var composizione in composizioni)
            //{
            //    decimal result = 0.0m;

            // try { //var tempodist = distanzaTempo.Result.Find(m =>
            // m.codice.Equals(composizione.Mezzo.Codice)); var ValoreAdeguatezzaMezzo =
            // GeneraValoreAdeguatezzaMezzo(Richiesta.Tipologie.Select(c => c.Codice).ToList(), composizione.Mezzo.Genere);

            // //result = 100 / (1 + Convert.ToDecimal(composizione.TempoPercorrenza.Replace(".",
            // ",")) / 5400) + ValoreAdeguatezzaMezzo.Result; result = 100 +
            // ValoreAdeguatezzaMezzo.Result; composizione.Km = "0";
            // //tempodist.distanza.ToString(); composizione.TempoPercorrenza = "0";
            // //tempodist.tempo.ToString(); composizione.IndiceOrdinamento = result; } catch
            // (Exception) { }

            //    yield return composizione;
            //}
        }

        private async Task<decimal> GeneraValoreAdeguatezzaMezzo(List<string> codiciTipologie, string genere)
        {
            var tipologie = _getTipologieByCodice.Get(codiciTipologie);

            if (tipologie != null) foreach (var tipologia in tipologie)
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

        //private async Task<ComposizioneMezzi> GetDistanceByGoogle(ComposizioneMezzi composizione, RichiestaAssistenza richiesta)
        //{
        //    var origine = $"origins={ composizione.Mezzo.Coordinate.Latitudine.ToString().Replace(",", ".")},{ composizione.Mezzo.Coordinate.Longitudine.ToString().Replace(",", ".")}";
        //    var destination = $"destinations={ richiesta.Localita.Coordinate.Latitudine.ToString().Replace(",", ".")},{ richiesta.Localita.Coordinate.Longitudine.ToString().Replace(",", ".")}";
        //    var mode = "mode=Driving";
        //    var sensor = "sensor=false";

        // StringContent queryString = new StringContent("");

        // var response = await _client.PostAsync(_configuration.GetSection("UrlExternalApi").GetSection("DistanceMatrix").Value
        // + $"&{origine}&{destination}&{mode}&{sensor}", queryString).ConfigureAwait(false);
        // response.EnsureSuccessStatusCode(); using HttpContent content = response.Content; string
        // data = await content.ReadAsStringAsync().ConfigureAwait(false); var distanza = JsonConvert.DeserializeObject<DistanceMatrix>(data);

        // if (distanza.Rows[0].Elements[0].Distance != null) { //LE Value sono espresse in SECONDI
        // composizione.Km = distanza.Rows[0].Elements[0].Distance.Text.ToString().Substring(0,
        // distanza.Rows[0].Elements[0].Distance.Text.ToString().Length - 2);
        // composizione.TempoPercorrenza = (distanza.Rows[0].Elements[0].Duration.Value /
        // 60).ToString(); } else { composizione.Km = "100"; composizione.TempoPercorrenza = "50"; }

        //    return composizione;
        //}
    }
}
