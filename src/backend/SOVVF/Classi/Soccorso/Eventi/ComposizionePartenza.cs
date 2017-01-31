using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modello.Classi.Soccorso.Eventi
{
    /// <summary>
    ///   Questa classe modella la composizione di una partenza. Si compongono le seguenti risorse:
    ///   * Codice Squadra
    ///   * Elenco persone relativi ruoli
    ///   * Elenco mezzi
    ///   * Elenco attrezzature
    /// </summary>
    /// <remarks>
    ///   Questo evento implicitamente associa il personale al mezzo/attrezzatura. Probabilmente
    ///   mezzi e attrezzature possono essere ricondotti ad un'unica categoria (risorsa strumentale).
    /// </remarks>
    public class ComposizionePartenza : Evento
    {
        /// <summary>
        ///   E' il codice della squadra coinvolta nella partenza, così come codificata nel modulo
        ///   relativo alla composizione dei servizi.
        /// </summary>
        public string CodiceSquadra { get; set; }

        /// <summary>
        ///   E' la lista dei componenti della partenza
        /// </summary>
        public IList<Componente> Componenti { get; set; }
    }
}
