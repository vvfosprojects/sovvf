using SO115App.API.Models.Classi.Composizione;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.Models.Classi.ESRI;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.GestioneTipologie;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ESRI;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.Composizione
{
    public class OrdinamentoMezzi
    {
        private readonly IGetTipologieByCodice _getTipologieByCodice;
        private readonly IGetDistanzaTempoMezzi _getDistanzaTempoMezzi;

        public OrdinamentoMezzi(IGetTipologieByCodice getTipologieByCodice, IGetDistanzaTempoMezzi getDistanzaTempoMezzi)
        {
            _getTipologieByCodice = getTipologieByCodice;
            _getDistanzaTempoMezzi = getDistanzaTempoMezzi;
        }

        public async Task<decimal> GetIndiceOrdinamento(RichiestaAssistenza Richiesta, ComposizioneMezzi composizione)
        {
            try
            {
                var distanzaTempo = _getDistanzaTempoMezzi.Get(new ESRI_DistanzaTempoMezzi()
                {
                    //
                });

                //composizione.Km = "";
                //composizione.TempoPercorrenza = "";

                var ValoreAdeguatezzaMezzo = GeneraValoreAdeguatezzaMezzo(Richiesta.Tipologie, composizione.Mezzo.Genere);

                return 100 / (1 + Convert.ToDecimal(composizione.TempoPercorrenza.Replace(".", ",")) / 5400) + ValoreAdeguatezzaMezzo.Result;
            }
            catch (Exception) { return 0; }
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
