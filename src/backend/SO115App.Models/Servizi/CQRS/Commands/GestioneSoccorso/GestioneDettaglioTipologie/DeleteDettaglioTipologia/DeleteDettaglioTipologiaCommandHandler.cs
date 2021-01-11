using CQRS.Commands;
using SO115App.Models.Servizi.Infrastruttura.GestioneDettaglioTipologie;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneDettaglioTipologie.DeleteDettaglioTipologia
{
    public class DeleteDettaglioTipologiaCommandHandler : ICommandHandler<DeleteDettaglioTipologiaCommand>
    {
        private readonly IDeleteDettaglioTipologia _deleteDettaglioTipologia;

        public DeleteDettaglioTipologiaCommandHandler(IDeleteDettaglioTipologia deleteDettaglioTipologia) => _deleteDettaglioTipologia = deleteDettaglioTipologia;

        public void Handle(DeleteDettaglioTipologiaCommand command)
        {
            _deleteDettaglioTipologia.Delete(command);
        }
    }
}
