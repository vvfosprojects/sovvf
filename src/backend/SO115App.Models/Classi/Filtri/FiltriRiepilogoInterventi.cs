using System;

namespace SO115App.Models.Classi.Filtri
{
    public class FiltriRiepilogoInterventi
    {
        public DateTime Da { get; set; }
        public DateTime A { get; set; }
        public string Turno { get; set; }
        public string Squadra { get; set; }
        public string Distaccamento { get; set; }

        public AltriFiltri AltriFiltri { get; set; }
    }

    public class AltriFiltri
    {
        public bool? SoloInterventi { get; set; } = false;
        /// <summary>
        /// Raggruppa per tipologie
        /// </summary>
        public bool? TipologiaIntervento { get; set; } = false;
        public bool? Trasmessi { get; set; } = false;
    }
}
