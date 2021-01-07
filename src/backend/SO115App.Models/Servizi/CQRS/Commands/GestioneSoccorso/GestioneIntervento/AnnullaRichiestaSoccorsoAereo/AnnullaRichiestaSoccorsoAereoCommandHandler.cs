using CQRS.Commands;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.AFM;
using System;
using System.Collections.Generic;
using System.Text;

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
            //get utente

            //command.Annullamento.OperatorFiscalCode = 
            //command.Annullamento.OperatorName =
            //command.Annullamento.OperatorSurname =

            _annullaRichiestaSoccorsoAereo.Annulla(command.Annullamento, command.Codice);
        }
    }
}
