using CQRS.Commands;
using SO115App.Models.Servizi.Infrastruttura.GestioneRubrica.Enti;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneRubrica.Enti.DeleteEnte
{
    public class DeleteEnteCommandHandler : ICommandHandler<DeleteEnteCommand>
    {
        private readonly IDeleteEnte _deleteEnte;

        public DeleteEnteCommandHandler(IDeleteEnte deleteEnte) => _deleteEnte = deleteEnte;

        public void Handle(DeleteEnteCommand command)
        {
            _deleteEnte.Delete(command.Id);
        }
    }
}
