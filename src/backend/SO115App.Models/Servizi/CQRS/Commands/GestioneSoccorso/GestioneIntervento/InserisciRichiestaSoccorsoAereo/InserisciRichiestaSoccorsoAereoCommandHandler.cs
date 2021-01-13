using CQRS.Commands;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Classi.ServiziEsterni.AFM;
using SO115App.Models.Classi.Soccorso.Eventi;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.AFM;
using System;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneIntervento.InserisciRichiestaSoccorsoAereo
{
    public class InserisciRichiestaSoccorsoAereoCommandHandler : ICommandHandler<InserisciRichiestaSoccorsoAereoCommand>
    {
        private readonly IAggiornaRichiestaSoccorsoAereo _aggiorna;
        private readonly ISaveRichiestaAssistenza _saveRichiestaAssistenza;

        public InserisciRichiestaSoccorsoAereoCommandHandler(IAggiornaRichiestaSoccorsoAereo aggiorna, ISaveRichiestaAssistenza saveRichiestaAssistenza)
        {
            _aggiorna = aggiorna;
            _saveRichiestaAssistenza = saveRichiestaAssistenza;
        }

        public void Handle(InserisciRichiestaSoccorsoAereoCommand command)
        {
            command.Richiesta.SoccorsoAereo = true;

            new RichiestaSoccorsoAereo(command.Richiesta, DateTime.Now, command.IdOperatore);

            //var richiestaSoccorsoAereo = new NuovaRichiestaSoccorsoAereo()
            //{
            //    Lat = (decimal)command.Richiesta.Localita.Coordinate.Latitudine,
            //    Lng = (decimal)command.Richiesta.Localita.Coordinate.Longitudine,
            //    RequestKey = command.RichiestaSoccorsoAereo.RequestKey,
            //    Description = command.RichiestaSoccorsoAereo.Description,
            //    Datetime = DateTime.Now,
            //    OnSiteContact = "",
            //    OperatorFiscalCode = command.RichiestaSoccorsoAereo.OperatorFiscalCode,
            //    OperatorName = command.RichiestaSoccorsoAereo.OperatorName,
            //    OperatorSurname = command.RichiestaSoccorsoAereo.OperatorSurname,
            //    RequestTypeCode = command.RichiestaSoccorsoAereo.RequestTypeCode,
            //    RescueCategories = command.RichiestaSoccorsoAereo.RescueCategories,
            //    Remarks = ""
            //};

            //Comunico al servizio esterno
            _aggiorna.Aggiorna(command.RichiestaSoccorsoAereo);

            //Aggiorno richiesta sul db
            _saveRichiestaAssistenza.Save(command.Richiesta);
        }
    }
}
