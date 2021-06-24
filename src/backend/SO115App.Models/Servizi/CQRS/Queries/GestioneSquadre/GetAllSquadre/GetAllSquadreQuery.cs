using CQRS.Queries;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneSquadre.GetAllSquadre
{
    public class GetAllSquadreQuery : IQuery<GetAllSquadreResult>
    {
        public string[] CodiciSede { get; set; }
    }
}
