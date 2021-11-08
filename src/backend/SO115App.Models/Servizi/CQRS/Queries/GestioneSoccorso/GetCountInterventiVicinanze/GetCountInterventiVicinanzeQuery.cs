using CQRS.Queries;
using SO115App.API.Models.Classi.Condivise;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GetCountInterventiVicinanze
{
    public class GetCountInterventiVicinanzeQuery : IQuery<GetCountInterventiVicinanzeResult>
    {
        public string IdOperatore { get; set; }
        public string[] CodiciSede { get; set; }
        public Coordinate Coordinate { get; set; }
        public string Indirizzo { get; set; }
        public string[] Competenze { get; set; }
    }
}
