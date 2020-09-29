using CQRS.Commands;
using SO115App.Models.Servizi.Infrastruttura.GestioneTrasferimentiChiamate;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneTrasferimentiChiamate.DeleteTrasferimento
{
    public class DeleteTrasferimentoCommandHandler : ICommandHandler<DeleteTrasferimentoCommand>
    {
        private readonly IDeleteTrasferimento _deleteTrasferimento;
        public DeleteTrasferimentoCommandHandler(IDeleteTrasferimento deleteTrasferimento) => _deleteTrasferimento = deleteTrasferimento;

        public void Handle(DeleteTrasferimentoCommand command)
        {
            _deleteTrasferimento.Delete(command.Id);
        }
    }
}
