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
    public class ComposizionePartenza
    {
        /// <summary>
        ///   E' il codice della squadra coinvolta nella partenza, così come codificata nel modulo
        ///   relativo alla composizione dei servizi.
        /// </summary>
        public string CodiceSquadra { get; set; }

        /// <summary>
        ///   E' il codice fiscale del capopartenza.
        /// </summary>
        /// <remarks>
        ///   Questo codice fiscale deve essere ripetuto nell'attributo Mezzi per indicare la
        ///   posizione del capopartenza all'interno di un mezzo. Non è un problema se questa codice
        ///   fiscale è contenuto anche nall'attributo ComponentiSenzaMezzo.
        /// </remarks>
        public string CodiceFiscaleCapopartenza { get; set; }

        /// <summary>
        ///   E' la lista dei mezzi e dei relativi passeggeri a bordo
        /// </summary>
        public IList<PartenzaMezzo> Mezzi { get; set; }

        /// <summary>
        ///   E' la lista dei componenti che non sono passeggeri di un mezzo
        /// </summary>
        /// <remarks>
        ///   Questa lista consente di non associare necessariamente un mezzo a delle persone (per
        ///   es. in caso di vigilanza o verifica statica).
        /// </remarks>
        public IList<string> ComponentiSenzaMezzo { get; set; }

        public IList<Componente> Componenti { get; set; }
    }
}
