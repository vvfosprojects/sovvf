using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.ApiNUE.Model
{
    public class SchedaContatto
    {
        /// <summary>
        ///   E' il codice della scheda contatto, proveniente dal NUE.
        /// </summary>
        public string CodiceScheda { get; set; }

        /// <summary>
        ///   E' la data inserimento della scheda contatto, proveniente dal NUE.
        /// </summary>
        public DateTime DataInserimento { get; set; }

        /// <summary>
        ///   E' il richiedente della scheda contatto, proveniente dal NUE.
        /// </summary>
        public Richiedente Richiedente { get; set; }

        /// <summary>
        ///   E' la localita della scheda contatto, proveniente dal NUE.
        /// </summary>
        public Localita Localita { get; set; }

        /// <summary>
        ///   E' la classificazione dell'evento della scheda contatto, proveniente dal NUE.
        /// </summary>
        public string ClassificazioneEvento { get; set; }

        /// <summary>
        ///   E' la categoria della scheda contatto, proveniente e valorizzata dal NUE.
        /// </summary>
        public string Categoria { get; set; }

        /// <summary>
        ///   Indica l'ente di competenza della scheda contatto.
        /// </summary>
        public string EnteCompetenza { get; set; }

        /// <summary>
        ///   E' il dettaglio della scheda contatto, proveniente dal NUE.
        /// </summary>
        public string Dettaglio { get; set; }

        /// <summary>
        ///   E' la priorità della scheda contatto, proveniente dal NUE.
        /// </summary>
        public int Priorita { get; set; }

        /// <summary>
        ///   E' il numero delle persone coinvolte provenienti dalla scheda contatto, proveniente dal NUE.
        /// </summary>
        public int NumeroPersoneCoinvolte { get; set; }

        /// <summary>
        ///   Contiente informazioni sull'operatore che gestisce la scheda contatto
        /// </summary>
        public Operatore OperatoreChiamata { get; set; }

        /// <summary>
        ///   Indica il tipo di scheda contatto: Competenza, Conoscenza, Differibile
        /// </summary>
        public string Classificazione { get; set; }

        /// <summary>
        ///   Indica se la scheda contatto è stata letta o meno
        /// </summary>
        public bool Letta { get; set; }

        /// <summary>
        ///   Indica se la scheda contatto è stata gestita o meno
        /// </summary>
        public bool Gestita { get; set; }
    }
}
