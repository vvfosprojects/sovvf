namespace SO115App.Models.Servizi.CQRS.Commands.GestioneRubrica.Enti.DeleteEnte
{
    public class DeleteEnteCommand
    {
        public string CodiceEnte { get; set; }

        public string[] CodiceSede { get; set; }
        public string idOperatore { get; set; }
    }
}
