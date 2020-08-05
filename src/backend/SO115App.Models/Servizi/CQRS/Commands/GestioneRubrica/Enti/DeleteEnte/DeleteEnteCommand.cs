namespace SO115App.Models.Servizi.CQRS.Commands.GestioneRubrica.Enti.DeleteEnte
{
    public class DeleteEnteCommand
    {
        public string Id { get; set; }

        public string[] CodiceSede { get; set; }
        public string idOperatore { get; set; }
        public bool Ricorsivo { get; set; }
    }
}
