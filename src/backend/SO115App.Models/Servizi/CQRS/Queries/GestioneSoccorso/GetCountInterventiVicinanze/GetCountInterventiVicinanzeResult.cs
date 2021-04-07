namespace SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GetCountInterventiVicinanze
{
    public class GetCountInterventiVicinanzeResult
    {
        public int Count { get; set; }
        public int CountStessaVia { get; set; }
        public int CountInterventiChiusiStessoIndirizzo { get; set; }
    }
}
