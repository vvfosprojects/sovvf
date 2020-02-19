using SO115App.API.Models.Classi.Autenticazione;
using SO115App.Models.Servizi.CQRS.Commands.GestioneUtenti.AddUtente;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Servizi.Infrastruttura.GestioneUtenti
{
    public interface IAddUtente
    {
        void Add(Utente utente);
    }
}
