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
        ///   E' un codice che identifica univocamente la sorgente da cui proviene la segnalazione.
        /// </summary>
        /// <remarks>
        ///   Viene implementato dalle classi derivate. Per es. nel caso di telefonata o SMS o fax è
        ///   il numero di telefono. Nel caso di email è l'indirizzo del mittente.
        /// </remarks>
        public abstract string CodiceOrigine { get; }

        /// <summary>
        ///   E' l'istante in cui la segnalazione è stata presa in carico.
        /// </summary>
        public DateTime IstantePresaInCarico { get; set; }

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
        ///   Al momento è un testo libero che non è elaborato dal sistema, ma è una semplice
        ///   annotazione. Non salviamo l'istante della definizione dell'esito perché sovrapponibile
        ///   con l'istante dell'evento di salvataggio contenuto nella classe antenata.
        /// </remarks>
        public string Esito { get; set; }
    }
}
