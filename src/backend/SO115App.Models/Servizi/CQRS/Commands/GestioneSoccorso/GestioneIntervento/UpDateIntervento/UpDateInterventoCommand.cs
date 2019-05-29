using SO115App.API.Models.Servizi.CQRS.Command.GestioneSoccorso.Shared;

namespace DomainModel.CQRS.Commands.UpDateIntervento
{
    public class UpDateInterventoCommand
    {
        public Intervento Chiamata { get; set; }
    }
}
