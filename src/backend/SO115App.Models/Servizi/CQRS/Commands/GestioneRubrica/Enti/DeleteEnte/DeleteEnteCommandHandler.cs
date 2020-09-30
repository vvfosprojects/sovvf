using CQRS.Commands;
using SO115App.Models.Servizi.Infrastruttura.GestioneRubrica.Enti;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneRubrica.Enti.DeleteEnte
{
    public class DeleteEnteCommandHandler : ICommandHandler<DeleteEnteCommand>
    {
        private readonly IDeleteEnte _deleteEnte;
        private readonly IGetRubrica _getRubrica;

        public DeleteEnteCommandHandler(IGetRubrica getRubrica, IDeleteEnte deleteEnte)
        {
            _deleteEnte = deleteEnte;
            _getRubrica = getRubrica;
        }

        public void Handle(DeleteEnteCommand command)
        {
            //PREPARO INFO PER NOTIFICA
            command.Ricorsivo = _getRubrica.Get(command.Id).Ricorsivo;

            //ESEGUO DELETE
            _deleteEnte.Delete(command.Id);
        }
    }
}
