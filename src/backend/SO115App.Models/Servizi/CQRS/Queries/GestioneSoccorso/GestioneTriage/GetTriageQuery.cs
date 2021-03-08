using CQRS.Queries;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GestioneTriage
{
    public class GetTriageQuery : IQuery<GetTriageResult>
    {
        public string[] CodiceSede { get; set; }
        public int CodTipologia { get; set; }
        public int CodDettaglioTipologia { get; set; }
    }
}
