using CQRS.Commands;
using SO115App.Models.Servizi.Infrastruttura.GestioneDettaglioTipologie;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneDettaglioTipologie.InserimentoDettaglioTipologia
{
    public class AddDettaglioTipologiaCommandHandler : ICommandHandler<AddDettaglioTipologiaCommand>
    {
        private readonly IAddDettaglioTipologia _addDettaglioTipologia;

        public AddDettaglioTipologiaCommandHandler(IAddDettaglioTipologia addDettaglioTipologia) => _addDettaglioTipologia = addDettaglioTipologia;

        public void Handle(AddDettaglioTipologiaCommand command)
        {
            command.DettaglioTipologia.CodSede = command.CodiceSede[0];

            _addDettaglioTipologia.Add(command.DettaglioTipologia);
        }
    }
}
