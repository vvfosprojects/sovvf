using SO115App.API.Models.Classi.Composizione;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.GestioneTipologie;
using System;
using System.Collections.Generic;

namespace SO115App.Persistence.MongoDB.GestioneMezzi
{
    public class OrdinamentoMezzi
    {
        private readonly IGetRichiestaById _getRichiestaById;
        private readonly IGetTipologieByCodice _getTipologieByCodice;

        public OrdinamentoMezzi(IGetRichiestaById getRichiestaById, IGetTipologieByCodice getTipologieByCodice)
        {
            _getRichiestaById = getRichiestaById;
            _getTipologieByCodice = getTipologieByCodice;
        }

        public decimal GetIndiceOrdinamento(string IdRichiesta, ComposizioneMezzi composizione, string IdRichiestaOrigine = null)
        {
            int ValoreIntOriginePerSganciamento = 0;
            decimal ValoreAdeguatezzaMezzo;

            var richiestaDestinazione = _getRichiestaById.GetById(IdRichiesta);

            if (IdRichiestaOrigine != null)
            {
                var richiestaOrigine = _getRichiestaById.GetById(IdRichiestaOrigine);
                ValoreIntOriginePerSganciamento = GeneraValoreSganciamento(richiestaOrigine.Tipologie);
            }

            ValoreAdeguatezzaMezzo = GeneraValoreAdeguatezzaMezzo(richiestaDestinazione.Tipologie, composizione.Mezzo.Genere);

            return 100 / (1 + Convert.ToDecimal(composizione.TempoPercorrenza.Replace(".", ",")) / 5400) + ValoreIntOriginePerSganciamento + ValoreAdeguatezzaMezzo;
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

        private int GeneraValoreSganciamento(List<string> codiciTipologie)
        {
            var tipologie = _getTipologieByCodice.Get(codiciTipologie);

            int IndiceSganciamento = 0;

            foreach (var tipologia in tipologie)
            {
                IndiceSganciamento += tipologia.OppSganc;
            }

            return IndiceSganciamento;
        }
    }
}
