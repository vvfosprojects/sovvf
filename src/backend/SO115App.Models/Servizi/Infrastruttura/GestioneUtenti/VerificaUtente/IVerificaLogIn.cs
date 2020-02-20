using SO115App.API.Models.Classi.Autenticazione;

namespace SO115App.Models.Servizi.Infrastruttura.GestioneUtenti.VerificaUtente
{
    /// <summary>
    ///   interfaccia che verifica che l'utente esiste e può procedere con il Login
    /// </summary>
    public interface IVerificaLogIn
    {
        /// <summary>
        ///   metodo dell'interfaccia verifica
        /// </summary>
        /// <param name="username">l'username dell'utente da verificare</param>
        /// <param name="password">la password dell'utente da verificare</param>
        /// <returns>un utente</returns>
        Utente Verifica(string username, string password);
    }
}
