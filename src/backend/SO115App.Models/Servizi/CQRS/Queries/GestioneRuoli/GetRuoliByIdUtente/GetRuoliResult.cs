using SO115App.API.Models.Classi.Autenticazione;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneRuoli.GetRuoliByIdUtente
{
    /// <summary>
    ///   il modello che restituisce il risultato della query
    /// </summary>
    public class GetRuoliResult
    {
        /// <summary>
        ///   la lista dei ruoli associati all'utente della query
        /// </summary>
        public IEnumerable<Role> Ruoli { get; set; }
    }
}
