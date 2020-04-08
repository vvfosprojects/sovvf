using Newtonsoft.Json;
using SO115App.API.Models.Classi.Autenticazione;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti.VerificaUtente;
using System.Collections.Generic;
using System.IO;

namespace SO115App.FakePersistence.JSon.GestioneUtenti
{
    /// <summary>
    ///   classe che trova l'utente a partire dal suo username sul fake json
    /// </summary>
    public class FindByUsername : IFindUserByUsername
    {
        /// <summary>
        ///   medoto della classe che si occupa del recupero dell'utente
        /// </summary>
        /// <param name="username">l'username dell'utente</param>
        /// <returns>l'utente corrispondente all'username</returns>
        public Utente FindUserByUs(string username)
        {
            Utente userFind = new Utente(username);

            string filepath = "Fake/user.json";
            string json;
            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            var ListaUtenti = JsonConvert.DeserializeObject<List<Utente>>(json);

            userFind = ListaUtenti.Find(x => x.Username.Equals(username));

            return userFind != null ? userFind : null;
        }
    }
}
