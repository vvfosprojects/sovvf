using Modello.Classi.Geo;
using System;

namespace Modello.Classi.Soccorso.Segnalazioni
{
    /// <summary>
    ///   Modella una segnalazione per assistenza da parte dei VVF. Può essere una telefonata, un
    ///   SMS, una scheda contatto, ecc.
    /// </summary>
    public abstract class Segnalazione : Evento
    {
        /// <summary>
        ///   E' l'identificativo univoco della segnalazione, utilizzabile anche a scopi
        ///   giuridici/amministrativi. Potrebbe essere un codice del tipo AX554HN.
        /// </summary>
        public string Codice { get; set; }

        /// <summary>
        ///   E'
        /// </summary>
        public abstract string CodiceOrigine { get; }

        /// <summary>
        ///   E' la geolocalizzazione della segnalazione. Proviene per esempio dall'integrazione col
        ///   112 (scheda contatto) nella forma di un punto, una poligonale, un cerchio, ecc.
        ///   Nota: non è la geolocalizzazione dell'evento calamitoso, vigilanza, ecc.
        /// </summary>
        public Geolocalizzazione Geolocalizzazione { get; set; }

        /// <summary>
        ///   Indica la motivazione per la quale è stata inoltrata segnalazione ai VVF
        /// </summary>
        public string Motivazione { get; set; }

        /// <summary>
        ///   E' l'esito che l'operatore assegna alla segnalazione.
        /// </summary>
        /// <remarks>
        ///   Al momento è un testo libero che non è elaborato dal sistema, ma è una semplice annotazione.
        /// </remarks>
        public string Esito { get; set; }

        /// <summary>
        ///   Indica la data in cui viene definito l'esito della segnalazione.
        /// </summary>
        public DateTime IstanteDefinizioneEsito { get; set; }
    }
}
