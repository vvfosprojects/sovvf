using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modello.Classi.Soccorso
{
    /// <summary>
    /// Questa classe modella la generica richiesta di assistenza inoltrata ai VVF. La richiesta può
    /// non avere seguito oppure generare un intervento da parte dei VVF.
    /// Esempi di istanze sono: richiesta per un incendio in un'abitazione, richiesta per porta bloccata,
    /// richiesta per vigilanza in occasione di una manifestazione, richiesta per partecipazione di una
    /// delegazione VVF ad un convegno.
    /// Non è un'istanza di richiesta il terremoto, che essendo un macro evento calamitoso darà luogo a
    /// più richieste di assistenza.
    /// </summary>
    public class RichiestaAssistenza
    {
        public RichiestaAssistenza()
        {
            this.Eventi = new List<Evento>();
        }

        #region Attributi

        /// <summary>
        /// Il codice intervento è un codice parlante che si utilizza per identificare
        /// univocamente una richiesta. Si può per esempio utilizzare nelle comunicazioni
        /// verbali.
        /// 
        /// Il codice è costituito da tre terzine.
        /// 
        /// I codici generati da SOVVF sono esclusivamente numerici e strettamente
        /// crescenti, incrementandosi di 1 a mano a mano che vengono generati dalla
        /// apposita routine di generazione. In questo modo si ha un totale di un
        /// miliardo di combinazioni disponibili.
        /// 
        /// Gli interventi importati da SO115 verranno mappati su una maschera del tipo:
        /// RM1.700.000
        /// in cui
        ///   - RM è il codice della provincia attualmente usato,
        ///   - 17 sono le ultime due cifre dell'anno dell'intervento
        ///   - le restanti cifre sono l'attuale numero intervento (senza progressivo)
        /// per un totale di 100.000 interventi mappabili per ogni anno (mai raggiunto).
        /// </summary>
        public string Codice { get; set; }

        /// <summary>
        /// Contiene la lista degli eventi considerati di interesse per la richiesta
        /// </summary>
        public IList<Evento> Eventi { get; set; }
        
        #endregion

        #region Metodi

        public IList<Chiamata> Chiamate
        {
            get
            {
                return Eventi
                    .Where(e => e is Chiamata)
                    .Select(e => e as Chiamata)
                    .ToList();
            }
        }

        #endregion
    }
}
