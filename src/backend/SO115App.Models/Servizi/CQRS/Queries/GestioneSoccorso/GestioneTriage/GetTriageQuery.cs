using CQRS.Queries;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GestioneTriage
{
    public class GetTriageQuery : IQuery<GetTriageResult>
    {
        public string[] CodiceSede { get; set; }
        public int CodTipologia { get; set; }
        public int CodDettaglioTipologia { get; set; }
    }
}
