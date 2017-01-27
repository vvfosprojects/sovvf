using Modello.Classi.Soccorso.Segnalazioni;
using System.Collections.Generic;
using System.Linq;

namespace Modello.Classi.Soccorso
{
    /// <summary>
    ///   Questa classe modella la generica richiesta di assistenza inoltrata ai VVF. La richiesta
    ///   può non avere seguito oppure generare un intervento da parte dei VVF. Esempi di istanze
    ///   sono: richiesta per un incendio in un'abitazione, richiesta per porta bloccata, richiesta
    ///         per vigilanza in occasione di una manifestazione, richiesta per partecipazione di una
    ///         delegazione VVF ad un convegno. Non è un'istanza di richiesta il terremoto, che
    ///         essendo un macro evento calamitoso darà luogo a più richieste di assistenza.
    /// </summary>
    public class RichiestaAssistenza
    {
        public RichiestaAssistenza()
        {
            this.Eventi = new List<Evento>();
        }

        #region Attributi

        /// <summary>
        ///   Il codice intervento è un codice parlante che si utilizza per identificare univocamente
        ///   una richiesta. Si può per esempio utilizzare nelle comunicazioni verbali o annotare su
        ///   un foglietto.
        ///
        ///   Il codice deve essere progettato con l'obiettivo di garantire i seguenti requisiti:
        ///   * facilità rinumerazione dei vecchi interventi;
        ///   * leggibilità del codice (per es. facilità di annotazione);
        ///   * facilità di comunicarlo verbalmente.
        ///
        ///   Si stabilisce di utilizzare un sistema del tipo 223.117.949, ossia un numero
        ///   progressivo raggruppato in terzine. Il codice è comunque di tipo stringa.
        ///
        ///   Il criterio di mapping dei codici dei vecchi interventi SO115 sarà del tipo:
        ///   RM1.700.700 (RM= sigla provincia, 1.7=anno e 00700=numero intervento)
        ///
        ///   Gli interventi importati da SO115 verranno mappati su una maschera del tipo:
        ///   RM1.700.000 in cui
        ///   - RM è il codice della provincia attualmente usato,
        ///   - 17 sono le ultime due cifre dell'anno dell'intervento
        ///   - le restanti cifre sono l'attuale numero intervento (senza progressivo) per un totale
        ///     di 100.000 interventi mappabili per ogni anno (mai raggiunto).
        /// </summary>
        public string Codice { get; set; }

        /// <summary>
        ///   Contiene la lista degli eventi considerati di interesse per la richiesta.
        /// </summary>
        public IList<Evento> Eventi { get; set; }

        /// <summary>
        ///   E' la lista ordinata (per importanza decrescente) delle tipologie di soccorso.
        /// </summary>
        /// <remarks>
        ///   Per es. è la lista { valanga, soccorso a persona, ricerca disperso, messa in sicurezza
        ///   } in un sinistro simile al Rigopiano
        /// </remarks>
        public IList<string> Tipologie { get; set; }

        #endregion Attributi

        #region Metodi

        /// <summary>
        ///   Es
        /// </summary>
        public IList<Telefonata> Telefonate
        {
            get
            {
                return Eventi
                    .Where(e => e is Telefonata)
                    .Select(e => e as Telefonata)
                    .ToList();
            }
        }

        #endregion Metodi
    }
}
