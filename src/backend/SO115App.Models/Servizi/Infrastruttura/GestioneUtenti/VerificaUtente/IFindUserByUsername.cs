using SO115App.API.Models.Classi.Autenticazione;

namespace SO115App.Models.Servizi.Infrastruttura.GestioneUtenti.VerificaUtente
{
    /// <summary>
    ///   interfaccia che si occupa del reperimento di un utente a partire dal suo username
    /// </summary>
    public interface IFindUserByUsername
    {
        /// <summary>
        ///   metodo che cerca la corrispondenza
        /// </summary>
        /// <param name="username">l'username dell'utente</param>
        /// <returns>un utente</returns>
        Utente FindUserByUs(string username);
    }
}
