using Newtonsoft.Json;
using SO115App.API.Models.Classi.Autenticazione;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti.VerificaUtente;
using System.Collections.Generic;
using System.IO;

namespace SO115App.FakePersistence.JSon.GestioneUtenti
{
    /// <summary>
    ///   classe che verifica sul json fake se i parametri di accesso username e password sono corretti
    /// </summary>
    public class VerificaLogIn : IVerificaLogIn
    {
        /// <summary>
        ///   medoto della classe che si occupa della verifica
        /// </summary>
        /// <param name="username"></param>
        /// <param name="password"></param>
        /// <returns>L'utente verificato</returns>
        public Utente Verifica(string username, string password)
        {
            Utente user = new Utente(username);

            string filepath = "Fake/user.json";
            string json;
            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            var ListaUtenti = JsonConvert.DeserializeObject<List<Utente>>(json);

            user = ListaUtenti.Find(x => x.Password.Equals(password) && x.Username.Equals(username));

            return user != null ? user : null;
        }
    }
}
