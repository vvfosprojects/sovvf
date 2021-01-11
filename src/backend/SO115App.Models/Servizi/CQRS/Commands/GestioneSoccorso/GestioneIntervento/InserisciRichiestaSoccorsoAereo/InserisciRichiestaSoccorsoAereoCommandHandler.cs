using CQRS.Commands;
using SO115App.Models.Classi.ServiziEsterni.AFM;
using SO115App.Models.Classi.Soccorso.Eventi;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.AFM;
using System;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneIntervento.InserisciRichiestaSoccorsoAereo
{
    public class InserisciRichiestaSoccorsoAereoCommandHandler : ICommandHandler<InserisciRichiestaSoccorsoAereoCommand>
    {
        private readonly IAggiornaRichiestaSoccorsoAereo _aggiorna;

        public InserisciRichiestaSoccorsoAereoCommandHandler(IAggiornaRichiestaSoccorsoAereo aggiorna)
        {
            _aggiorna = aggiorna;
        }

        public void Handle(InserisciRichiestaSoccorsoAereoCommand command)
        {
            command.Richiesta.SoccorsoAereo = true;

            new RichiestaSoccorsoAereo(command.Richiesta, DateTime.Now, command.IdOperatore);

            var richiestaSoccorsoAereo = new NuovaRichiestaSoccorsoAereo()
            {
                Lat = (decimal)command.Richiesta.Localita.Coordinate.Latitudine,
                Lng = (decimal)command.Richiesta.Localita.Coordinate.Longitudine,
                RequestKey = command.RichiestaSoccorsoAereo.RequestKey,
                Description = command.RichiestaSoccorsoAereo.Description,
                Datetime = DateTime.Now,
                OnSiteContact = "",
                OperatorFiscalCode = command.RichiestaSoccorsoAereo.OperatorFiscalCode,
                OperatorName = command.RichiestaSoccorsoAereo.OperatorName,
                OperatorSurname = command.RichiestaSoccorsoAereo.OperatorSurname,
                RequestTypeCode = command.RichiestaSoccorsoAereo.RequestTypeCode,
                RescueCategories = command.RichiestaSoccorsoAereo.RescueCategories,
                Remarks = ""
            };

            _aggiorna.Aggiorna(richiestaSoccorsoAereo);
        }
    }
}
