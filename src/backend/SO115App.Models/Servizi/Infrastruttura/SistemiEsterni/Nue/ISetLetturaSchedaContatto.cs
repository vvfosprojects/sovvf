using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue
{
    /// <summary>
    ///   Interfaccia del servizio che aggiorna lo stato di lettura della Scheda Contatto
    /// </summary>
    public interface ISetLetturaSchedaContatto
    {
        /// <summary>
        ///   Aggiorna lo stato di lettura della Scheda Contatto
        /// </summary>
        /// <returns>Non restituisce nulla</returns>
        void SetLetturaSchedaContatto(string codiceSede, string codiceScheda, string codiceFiscale, bool letta);
    }
}
