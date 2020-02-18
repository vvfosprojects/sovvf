using SO115App.Models.Classi.Utenti.Autenticazione;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneUtente.ListaPersonaleVVF
{
    public class PersonaleVVFResult
    {
        public List<PersonaleVVF> ListaPersonale { get; set; }
    }
}
