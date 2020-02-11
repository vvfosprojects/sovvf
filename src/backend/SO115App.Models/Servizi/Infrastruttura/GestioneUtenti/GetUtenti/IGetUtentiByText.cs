using SO115App.API.Models.Classi.Autenticazione;
using SO115App.Models.Classi.Utenti;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Servizi.Infrastruttura.GestioneUtenti.GetUtenti
{
    internal interface IGetUtentiByText
    {
        public List<Utente> Get(string text);
    }
}
