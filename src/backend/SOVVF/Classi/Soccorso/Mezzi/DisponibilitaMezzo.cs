using Modello.Classi.Soccorso.Risorse;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modello.Classi.Soccorso.Mezzi
{
    /// <summary>
    ///   E' la classe che identifica la disponibilità corrente di un mezzo di soccorso presso una
    ///   unità operativa per il soccorso.
    /// </summary>
    public class DisponibilitaMezzo
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
        public SelezioneRisorsa Selezionata { get; set; }
    }
}
