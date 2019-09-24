using System;
using System.Collections.Generic;
using System.Text;
using SO115App.API.Models.Classi.Condivise;

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
