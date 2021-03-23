using CQRS.Commands;
using SO115App.Models.Servizi.Infrastruttura.GestioneTriage;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneTriage.AddTriage
{
    public class AddTriageCommandHandler : ICommandHandler<AddTriageCommand>
    {
        private readonly IAddTriage _addTrige;

        public AddTriageCommandHandler(IAddTriage addTrige) => _addTrige = addTrige;

        public void Handle(AddTriageCommand command)
        {
            _addTrige.Add(command);
        }
    }
}
