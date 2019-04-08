using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Autenticazione;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Servizi.Infrastruttura.Autenticazione;

namespace SO115App.API.Models.Classi.Utenti.Autenticazione
{
    public class AuthOperatore : IAuthOperatore
    {

        //TODO, DA TOGLIERE - SERVE SOLO PER I FAKE
        public enum utente {
            admin,
            user,
            test           
        }

        public async Task<Utente> Login(string username, string password)
        {
            Utente user = VerificaLogIn(username,password);            

            return user;
        }

        //TODO DA MODIFICARE CON LA LOGICA DEL DB
        private Utente VerificaLogIn(string username, string password)
        {
            Utente user = new Utente(username);

            string filepath = "user.json";
            string json;
            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();              
            }

            List<Utente> ListaUtenti = JsonConvert.DeserializeObject<List<Utente>>(json);

            user = ListaUtenti.Find(x => x.password.Equals(password) && x.username.Equals(username));

            if(user != null)
                return user;
            else
                return null; 
                        
        }
    }
}