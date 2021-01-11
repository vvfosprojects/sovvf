using CQRS.Commands;
using SO115App.Models.Classi.Soccorso.Eventi;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.AFM;
using System;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneIntervento.AnnullaRichiestaSoccorsoAereo
{
    public class AnnullaRichiestaSoccorsoAereoCommandHandler : ICommandHandler<AnnullaRichiestaSoccorsoAereoCommand>
    {
        private readonly IAnnullaRichiestaSoccorsoAereo _annullaRichiestaSoccorsoAereo;

        public AnnullaRichiestaSoccorsoAereoCommandHandler(IAnnullaRichiestaSoccorsoAereo annullaRichiestaSoccorsoAereo)
        {
            _annullaRichiestaSoccorsoAereo = annullaRichiestaSoccorsoAereo;
        }

        public void Handle(AnnullaRichiestaSoccorsoAereoCommand command)
        {
            command.Richiesta.SoccorsoAereo = false;

            new AnnullamentoRichiestaSoccorsoAereo(command.Richiesta, DateTime.Now, command.IdOperatore);

            _annullaRichiestaSoccorsoAereo.Annulla(command.Annullamento, command.Codice);
        }
    }
}
