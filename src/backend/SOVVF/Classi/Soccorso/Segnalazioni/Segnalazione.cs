using Modello.Classi.Geo;

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
        ///   Indica la motivazione percui questa segnalazione è considerata inutile. Se il campo è
        ///   null la segnalazione è considerata inutile.
        /// </summary>
        /// <remarks>
        ///   Una segnalazione, pur se messa agli atti, è considerata inutile quando non influisce
        ///   sulle azioni di soccorso.
        /// </remarks>
        public string InutilePerche { get; set; }

        public bool Utile
        {
            get
            {
                return string.IsNullOrWhiteSpace(InutilePerche);
            }
        }
    }
}
