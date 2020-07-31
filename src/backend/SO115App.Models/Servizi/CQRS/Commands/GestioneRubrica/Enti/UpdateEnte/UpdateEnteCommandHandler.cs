using CQRS.Commands;
using SO115App.Models.Servizi.Infrastruttura.GestioneRubrica.Enti;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneRubrica.Enti.UpdateEnte
{
    public class UpdateEnteCommandHandler : ICommandHandler<UpdateEnteCommand>
    {
        private readonly IUpdateEnte _updateEnte;
        public UpdateEnteCommandHandler(IUpdateEnte updateEnte) => _updateEnte = updateEnte;

        public void Handle(UpdateEnteCommand command)
        {
            _updateEnte.Update(command.Ente);
        }
    }
}
