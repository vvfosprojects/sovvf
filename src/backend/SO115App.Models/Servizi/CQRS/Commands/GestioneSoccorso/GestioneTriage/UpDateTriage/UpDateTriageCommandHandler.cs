using CQRS.Commands;
using SO115App.Models.Servizi.Infrastruttura.GestioneDettaglioTipologie;
using SO115App.Models.Servizi.Infrastruttura.GestioneTriage;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneTriage.UpDateTriage
{
    public class UpDateTriageCommandHandler : ICommandHandler<UpDateTriageCommand>
    {
        private readonly IUpDateTriage _addTrige;

        public UpDateTriageCommandHandler(IUpDateTriage addTrige) => _addTrige = addTrige;

        public void Handle(UpDateTriageCommand command)
        {
            _addTrige.UpDate(command);
        }
    }
}
