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
        public ISet<Componente> Componenti { get; set; }

        /// <summary>
        ///   Restituisce il codice fiscale del capopartenza presente all'interno dei componenti.
        /// </summary>
        public string CodiceFiscaleCapopartenza
        {
            get
            {
                var componenteCapopartenza = this.Componenti.FirstOrDefault(c => c.Ruoli.Contains(Componente.Ruolo.CapoPartenza));

                if (componenteCapopartenza != null)
                {
                    return componenteCapopartenza.CodiceFiscale;
                }

                return null;
            }
        }

        /// <summary>
        ///   Restituisce l'insieme dei codici fiscali relativi alla partenza
        /// </summary>
        public ISet<string> CodiciFiscaliComponenti
        {
            get
            {
                return new HashSet<string>(this
                    .Componenti
                    .Select(c => c.CodiceFiscale));
            }
        }

        /// <summary>
        ///   Restituisce il numero di componenti della <see cref="ComposizionePartenza" />
        /// </summary>
        public int NumeroComponenti
        {
            get
            {
                return this.Componenti.Count;
            }
        }
    }
}
