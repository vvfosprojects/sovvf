using CQRS.Commands;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Classi.Soccorso.Eventi;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.AFM;
using System;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneIntervento.AnnullaRichiestaSoccorsoAereo
{
    public class AnnullaRichiestaSoccorsoAereoCommandHandler : ICommandHandler<AnnullaRichiestaSoccorsoAereoCommand>
    {
        private readonly IAnnullaRichiestaSoccorsoAereo _annullaRichiestaSoccorsoAereo;
        private readonly IUpDateRichiestaAssistenza _updateRichiesta;

        public AnnullaRichiestaSoccorsoAereoCommandHandler(IAnnullaRichiestaSoccorsoAereo annullaRichiestaSoccorsoAereo, IUpDateRichiestaAssistenza updateRichiesta)
        {
            _annullaRichiestaSoccorsoAereo = annullaRichiestaSoccorsoAereo;
            _updateRichiesta = updateRichiesta;
        }

        public void Handle(AnnullaRichiestaSoccorsoAereoCommand command)
        {
            command.Richiesta.RichiestaSoccorsoAereo = false;

            new AnnullamentoRichiestaSoccorsoAereo(command.Richiesta, DateTime.Now, command.IdOperatore);

            //Comunico al servizio esterno
            _annullaRichiestaSoccorsoAereo.Annulla(command.Annullamento, command.Codice);

            //Salvo richiesta sul db
            _updateRichiesta.UpDate(command.Richiesta);
        }
    }
}
