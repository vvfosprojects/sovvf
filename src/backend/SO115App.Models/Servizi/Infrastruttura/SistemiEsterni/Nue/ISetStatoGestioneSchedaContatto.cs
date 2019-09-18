using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue
{
    /// <summary>
    ///   Interfaccia del servizio che aggiorna lo stato di gestione della Scheda Contatto
    /// </summary>
    public interface ISetStatoGestioneSchedaContatto
    {
        /// <summary>
        ///   Aggiorna lo stato di gestione della Scheda Contatto
        /// </summary>
        /// <returns>Non restituisce nulla</returns>
        void SetStatoGestioneSchedaContatto(string CodiceSede, string CodiceScheda, string CodiceFiscale, string Stato);
    }
}
