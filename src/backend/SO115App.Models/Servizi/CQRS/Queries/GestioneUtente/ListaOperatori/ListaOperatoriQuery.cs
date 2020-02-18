using CQRS.Queries;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Classi.Filtri;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneUtente.ListaOperatori
{
    public class ListaOperatoriQuery : IQuery<ListaOperatoriResult>
    {
        public string CodiceSede { get; set; }

        public Paginazione Paginazione { get; set; }

        public FiltriUtenti Filtri { get; set; }
    }
}
