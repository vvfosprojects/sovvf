using CQRS.Queries;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneSedi.GetSediAllerta
{
    public class GetSediAllertaQuery : IQuery<GetSediAllertaResult>
    {
        public string[] CodiciSede { get; set; }
        public string IdUtente { get; set; }
    }
}
