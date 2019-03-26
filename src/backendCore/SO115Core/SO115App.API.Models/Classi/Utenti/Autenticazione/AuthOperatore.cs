using System;
using System.Collections.Generic;
using System.Threading.Tasks;
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

            if(username.Equals("admin") || username.Equals("test") || username.Equals("user"))
            {
                if(username.Equals("admin"))
                {
                    if(password.Equals("admin"))
                    {
                        user.id = "1";
                        user.nome = "Luigi";
                        user.cognome = "Bianchi";
                        user.sede = new Sede("RM","Comando di Roma","Via Cavour 5",null,null,null,null,"RM","Lazio");
                        user.ruolo = new List<Ruolo>(){
                            Ruolo.Admin
                        };   

                        return user;
                    }
                    else
                    {
                        return null;
                    }
                }else if(username.Equals("test"))
                {
                    if(password.Equals("test"))
                    {
                        user.id = "2";
                        user.nome = "Mario";
                        user.cognome = "Rossi";
                        user.sede = new Sede("RM","Comando di Roma","Via Cavour 5",null,null,null,null,"RM","Lazio");
                        user.ruolo = new List<Ruolo>(){
                            Ruolo.Admin
                        };

                        return user;
                    }
                    else
                    {
                        return null;
                    }
                }else if(username.Equals("user"))
                {
                    if(password.Equals("user"))
                    {
                        user.id = "3";
                        user.nome = "Teresio";
                        user.cognome = "Mancini";
                        user.sede = new Sede("RM","Comando di Roma","Via Cavour 5",null,null,null,null,"RM","Lazio");
                        user.ruolo = new List<Ruolo>(){
                            Ruolo.User
                        };
                        return user;
                    }
                    else
                    {
                        return null;
                    }
                }
                else
                    return null;                
            }
            else
                return null;          
        }
    }
}