using CQRS.Commands.Notifiers;
using System;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneIntervento.AnnullaRichiestaSoccorsoAereo
{
    public class AnnullaRichiestaSoccorsoAereoNotifier : ICommandNotifier<AnnullaRichiestaSoccorsoAereoCommand>
    {
        public AnnullaRichiestaSoccorsoAereoNotifier()
        {

        }

        public void Notify(AnnullaRichiestaSoccorsoAereoCommand command)
        {
            throw new NotImplementedException();
        }
    }
}
