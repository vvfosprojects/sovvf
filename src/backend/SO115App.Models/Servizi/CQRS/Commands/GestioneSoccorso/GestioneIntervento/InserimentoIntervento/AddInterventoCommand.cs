using SO115App.API.Models.Servizi.CQRS.Command.GestioneSoccorso.Shared;

namespace DomainModel.CQRS.Commands.AddIntervento
{
    public class AddInterventoCommand
    {
        public InserimentoChiamata Chiamata { get; set; }
    }
}
