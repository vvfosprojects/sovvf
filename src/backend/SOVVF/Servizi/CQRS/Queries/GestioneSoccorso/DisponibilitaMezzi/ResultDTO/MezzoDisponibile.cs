using System;

namespace Modello.Servizi.CQRS.Queries.GestioneSoccorso.DisponibilitaMezzi.ResultDTO
{
    /// <summary>
    ///   Modella il mezzo disponibile
    /// </summary>
    public class MezzoDisponibile
    {
        /// <summary>
        ///   E' l'identificativo del mezzo
        /// </summary>
        public string CodiceMezzo { get; set; }

        /// <summary>
        ///   Unità operativa responsabile della gestione operativa del mezzo
        /// </summary>
        public string CodiceUnitaOperativaResponsabile { get; set; }

        /// <summary>
        ///   E' l'istante in cui non è più disponibile il mezzo.
        /// </summary>
        public DateTime? IstanteFineDisponibilita { get; set; }

        /// <summary>
        ///   Indica l'eventuale stato di selezione del Mezzo. Un Mezzo selezionato è disponibile per
        ///   la Composizione Partenza solo all'operatore che ha effettuato la selezione. Risolve la
        ///   contesa della risorsa <see cref="DisponibilitaMezzo" /> con la semantica Test and Set.
        /// </summary>
        public SelezioneMezzo Selezionata { get; private set; }
    }
}
