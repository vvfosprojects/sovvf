using CQRS.Queries;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneSedi.GetSediTrasferimenti
{
    public class GetSediTrasferimentiQuery : IQuery<GetSediTrasferimentiResult>
    {
        public string[] CodiciSede { get; set; }
        public string IdUtente { get; set; }
    }
}
