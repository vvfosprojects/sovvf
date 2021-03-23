using SO115App.API.Models.Classi.Condivise;
using System;

namespace SO115App.Models.Classi.Condivise
{
    public class Localizzazione
    {
        /// <summary>
        ///   Identifica le coordinate del mezzo
        /// </summary>
        public Coordinate Coordinate { get; set; }

        /// <summary>
        ///   descrive l'isatnte di acquisizione delle coordinate
        /// </summary>
        public DateTime IstanteAcquisizione { get; set; }
    }
}
