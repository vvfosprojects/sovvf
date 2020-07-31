using CQRS.Commands;
using SO115App.Models.Servizi.Infrastruttura.GestioneRubrica;
using System;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneRubrica.UpdateEnte
{
    public class UpdateEnteCommandHandler : ICommandHandler<UpdateEnteCommand>
    {
        private readonly IUpdateEnte _updateEnte;
        public UpdateEnteCommandHandler(IUpdateEnte updateEnte) => _updateEnte = updateEnte;

        public void Handle(UpdateEnteCommand command)
        {
            throw new NotImplementedException();
        }
    }
}
