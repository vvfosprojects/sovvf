using CQRS.Commands;
using SO115App.Models.Servizi.Infrastruttura.GestioneRubrica;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneRubrica.AddEnte
{
    public class AddEnteCommandHandler : ICommandHandler<AddEnteCommand>
    {
        private readonly IAddEnte _addEnte;
        public AddEnteCommandHandler(IAddEnte addEnte) => _addEnte = addEnte;

        public void Handle(AddEnteCommand command)
        {
            _addEnte.Add(command.Ente);
        }
    }
}
