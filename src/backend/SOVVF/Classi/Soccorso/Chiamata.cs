using Modello.Classi.Geo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modello.Classi.Soccorso
{
    /// <summary>
    /// Modella una 
    /// </summary>
    public class Chiamata : Evento
    {
        /// <summary>
        /// E' l'identificativo univoco della chiamata, utilizzabile anche a scopi
        /// giuridici/amministrativi.
        /// Potrebbe essere un codice del tipo AX554HN.
        /// </summary>
        public string Codice { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public string CodiceChiamante { get; set; }

        /// <summary>
        /// E' la geolocalizzazione del chiamante. Proviene per esempio dall'integrazione col
        /// 112 (scheda contatto) nella forma di un punto, una poligonale, un cerchio, ecc.
        /// </summary>
        public Geolocalizzazione GeolocalizzazioneChiamante { get; set; }
    }
}
