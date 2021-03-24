using SO115App.API.Models.Classi.Autenticazione;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.Infrastruttura.GestioneUtenti.GetUtenti
{
    internal interface IGetUtentiByText
    {
        public List<Utente> Get(string text);
    }
}
