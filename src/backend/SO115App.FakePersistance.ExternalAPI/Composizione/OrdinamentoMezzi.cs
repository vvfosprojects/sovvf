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
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.Composizione
{
    public class OrdinamentoMezzi : IOrdinamentoMezzi
    {
        private readonly IGetTipologieByCodice _getTipologieByCodice;
        private readonly IGetDistanzaTempoMezzi _getDistanzaTempoMezzi;

        public OrdinamentoMezzi(IGetTipologieByCodice getTipologieByCodice, IGetDistanzaTempoMezzi getDistanzaTempoMezzi)
        {
            _getTipologieByCodice = getTipologieByCodice;
            _getDistanzaTempoMezzi = getDistanzaTempoMezzi;
        }

        public async Task<List<ComposizioneMezzi>> GetIndiceOrdinamento(RichiestaAssistenza Richiesta, List<ComposizioneMezzi> composizioni)
        {
            return GetIndiceOrdinamentoFunc(Richiesta, composizioni).ToList();
        }

        private IEnumerable<ComposizioneMezzi> GetIndiceOrdinamentoFunc(RichiestaAssistenza Richiesta, List<ComposizioneMezzi> composizioni)
        {
            var lstMezziEsri = composizioni.Select(c => new ESRI_Mezzo()
            {
                codice = c.Mezzo.Codice,
                coordinate = string.Join(", ", c.Mezzo?.CoordinateStrg ?? new string[] { "0", "0" }),
                track = !c.Mezzo.Genere.Equals("AV"),
            }).ToList();

            var distanzaTempo = _getDistanzaTempoMezzi.Get(new ESRI_DistanzaTempoMezzi()
            {
                coordinateIntervento = string.Join(", ", Richiesta.Localita.CoordinateString ?? new string[] { "0", "0" }),
                mezzi = lstMezziEsri
            });

            foreach (var composizione in composizioni)
            {
                decimal result = 0.0m;

                try
                {

                    var tempodist = distanzaTempo.Result.Find(m => m.codice.Equals(composizione.Mezzo.Codice));

                    var ValoreAdeguatezzaMezzo = GeneraValoreAdeguatezzaMezzo(Richiesta.Tipologie.Select(c => c.Codice).ToList(), composizione.Mezzo.Genere);

                    result = 100 / (1 + Convert.ToDecimal(composizione.TempoPercorrenza.Replace(".", ",")) / 5400) + ValoreAdeguatezzaMezzo.Result;

                    composizione.Km = tempodist.distanza.ToString();
                    composizione.TempoPercorrenza = tempodist.tempo.ToString();
                    composizione.IndiceOrdinamento = result;
                }
                catch (Exception) { }

                yield return composizione;
            }
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
    }
}
