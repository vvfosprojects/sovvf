using SO115App.API.Models.Classi.Autenticazione;
using SO115App.Models.Classi.Condivise;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneUtente.ListaOperatori
{
    public class ListaOperatoriResult
    {
        public Paginazione Paginazione { get; set; }
        public List<Utente> ListaOperatori { get; set; }
    }
}
