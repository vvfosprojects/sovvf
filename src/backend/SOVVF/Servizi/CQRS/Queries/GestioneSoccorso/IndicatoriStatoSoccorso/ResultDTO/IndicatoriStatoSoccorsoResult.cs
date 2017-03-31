using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modello.Servizi.CQRS.Queries.GestioneSoccorso.IndicatoriStatoSoccorso.ResultDTO
{
    /// <summary>
    ///   Contiene gli indicatori sullo stato del soccorso
    /// </summary>
    public class IndicatoriStatoSoccorsoResult
    {
        /// <summary>
        ///   E' il numero di richieste di assistenza non prese in carico
        /// </summary>
        public int NumeroRichiesteInAttesa { get; set; }

        /// <summary>
        ///   E' il numero di richieste di assistenza sospese
        /// </summary>
        /// <remarks>
        ///   Le richieste sospese sono quelle alle quali sono state sottratte tutte le risorse per
        ///   causa di forza maggiore e risultano non presidiate
        /// </remarks>
        public int NumeroRichiesteSospese { get; set; }

        /// <summary>
        ///   E' il numero di richieste prese in carico e non ancora chiuse
        /// </summary>
        public int NumeroRichiesteInCorso { get; set; }

        /// <summary>
        ///   E' il numero dei mezzi sul posto per le richieste
        /// </summary>
        public int NumeroMezziSoccorsoImpegnati { get; set; }

        /// <summary>
        ///   E' il numero dei mezzi in viaggio per le richieste
        /// </summary>
        public int NumeroMezziSoccorsoInViaggio { get; set; }

        /// <summary>
        ///   E' il numero dei mezzi in rientro per le richieste
        /// </summary>
        public int NumeroMezziSoccorsoInRientro { get; set; }

        /// <summary>
        ///   E' il numero totale dei mezzi correntemente disponibili adibiti al soccorso
        /// </summary>
        public int NumeroTotaleMezziSoccorso { get; set; }

        /// <summary>
        ///   E' il numero delle squadre impegnate su una richiesta
        /// </summary>
        public int NumeroSquadreSoccorsoImpegnate { get; set; }

        /// <summary>
        ///   E' il numero totale delle squadre correntemente disponibili adibite al soccorso
        /// </summary>
        public int NumeroTotaleSquadreSoccorso { get; set; }
    }
}
