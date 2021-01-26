using CQRS.Commands;
using SO115App.Models.Servizi.Infrastruttura.GestioneDettaglioTipologie;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneDettaglioTipologie.ModificaDettaglioTipologia
{
    public class ModifyDettaglioTipologiaCommandHandler : ICommandHandler<ModifyDettaglioTipologiaCommand>
    {
        private readonly IModifyDettaglioTipologia _modifyDettaglioTipologia;

        public ModifyDettaglioTipologiaCommandHandler(IModifyDettaglioTipologia modifyDettaglioTipologia) => _modifyDettaglioTipologia = modifyDettaglioTipologia;

        public void Handle(ModifyDettaglioTipologiaCommand command)
        {
            command.DettaglioTipologia.CodSede = command.CodiceSede[0];

            _modifyDettaglioTipologia.Modify(command.DettaglioTipologia);
        }
    }
}
