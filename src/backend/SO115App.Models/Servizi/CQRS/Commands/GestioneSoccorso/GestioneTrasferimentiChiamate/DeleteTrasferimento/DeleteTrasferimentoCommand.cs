namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneTrasferimentiChiamate.DeleteTrasferimento
{
    public class DeleteTrasferimentoCommand
    {
        public string IdOperatore { get; set; }
        public string CodiceSede { get; set; }

        public string Id { get; set; }
    }
}
