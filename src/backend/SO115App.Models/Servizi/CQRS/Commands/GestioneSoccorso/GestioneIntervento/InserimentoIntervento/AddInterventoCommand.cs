using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;

namespace DomainModel.CQRS.Commands.AddIntervento
{
    public class AddInterventoCommand
    {
        public SintesiRichiesta sintesiRichiesta { get; set; }
    }
}
