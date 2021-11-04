using SO115App.API.Models.Classi.Condivise;

namespace SO115App.Models.Classi.ServiziEsterni.UtenteComune
{
    /// <summary>
    ///   oggetto della sede associata ad una persona fisica del personale in arrivo dal servizio
    ///   Utenti Comuni
    /// </summary>
    public class SedeUC
    {
        /// <summary>
        ///   l'id della sede.
        /// </summary>
        public string id { get; set; }

        /// <summary>
        ///   la descrizione della sede
        /// </summary>
        public string descrizione { get; set; }

        /// <summary>
        /// Coordinate della sede
        /// </summary>
        public string coordinate { get; set; }

        public Coordinate Coordinate
        {
            get
            {
                try
                {
                    return new Coordinate(double.Parse(coordinate?.Split(',')[0] ?? "0"), double.Parse(coordinate?.Split(',')?[1] ?? "0"));
                }
                catch (System.Exception e)
                {
                    return new Coordinate(0, 0);
                }
            }
        }

        public string codice { get; set; }
        public string codDistaccamento { get; set; }
        public string tipo { get; set; }
        public string tipoOriginale { get; set; }
        public TipologiaDistaccamentoUC tipologiaDistaccamento { get; set; }
        public string provincia { get; set; }
    }

    public class TipologiaDistaccamentoUC
    {
        public string codice { get; set; }
        public string descrizione { get; set; }
    }
}
