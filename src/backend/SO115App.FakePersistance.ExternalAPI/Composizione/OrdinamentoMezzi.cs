﻿using SO115App.API.Models.Classi.Composizione;
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

        public async Task<List<decimal>> GetIndiceOrdinamento(RichiestaAssistenza Richiesta, List<ComposizioneMezzi> composizioni)
        {
            return GetIndiceOrdinamentoFunc(Richiesta, composizioni).ToList();
        }

        private IEnumerable<decimal> GetIndiceOrdinamentoFunc(RichiestaAssistenza Richiesta, List<ComposizioneMezzi> composizioni)
        {
            var lstMezziEsri = composizioni.Select(c => new ESRI_Mezzo()
            {
                CodiceMezzo = c.Mezzo.Codice,
                Coordinate = string.Concat(c.Mezzo.CoordinateStrg),
                Track = c.Mezzo.Genere.Equals("AV") ? false : true,
            }).ToList();

            foreach (var composizione in composizioni)
            {
                decimal result = 0.0m;

                try
                {
                    var distanzaTempo = _getDistanzaTempoMezzi.Get(new ESRI_DistanzaTempoMezzi()
                    {
                        CoordinateIntervento = string.Concat(Richiesta.Localita.CoordinateString),
                        Mezzi = lstMezziEsri
                    });

                    var tempodist = distanzaTempo.Result.ArrayMezzi.Find(m => m.Codice.Equals(composizione.Mezzo.Codice));

                    composizione.Km = tempodist.Km;
                    composizione.TempoPercorrenza = tempodist.Minuti;

                    var ValoreAdeguatezzaMezzo = GeneraValoreAdeguatezzaMezzo(Richiesta.Tipologie, composizione.Mezzo.Genere);

                    result = 100 / (1 + Convert.ToDecimal(composizione.TempoPercorrenza.Replace(".", ",")) / 5400) + ValoreAdeguatezzaMezzo.Result;
                }
                catch (Exception) { }

                yield return result;
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
