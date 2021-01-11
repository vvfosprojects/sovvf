using CQRS.Commands;
using SO115App.Models.Classi.ServiziEsterni.AFM;
using SO115App.Models.Classi.Soccorso.Eventi;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.AFM;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneIntervento.InserisciRichiestaSoccorsoAereo
{
    public class InserisciRichiestaSoccorsoAereoCommandHandler : ICommandHandler<InserisciRichiestaSoccorsoAereoCommand>
    {
        private readonly IAggiornaRichiestaSoccorsoAereo _aggiorna;
        private readonly IGetRichiestaById _getRichiestaById;

        public InserisciRichiestaSoccorsoAereoCommandHandler(IAggiornaRichiestaSoccorsoAereo aggiorna, IGetRichiestaById getRichiestaById)
        {
            _aggiorna = aggiorna;
            _getRichiestaById = getRichiestaById;
        }

        public void Handle(InserisciRichiestaSoccorsoAereoCommand command)
        {
            var richiesta = _getRichiestaById.GetByCodiceRichiesta(command.CodiceRichiesta);

            new RichiestaSoccorsoAereo(richiesta, DateTime.Now, command.IdOperatore);

            var richiestaSoccorsoAereo = new NuovaRichiestaSoccorsoAereo()
            {
                Lat = (decimal)richiesta.Localita.Coordinate.Latitudine,
                Lng = (decimal)richiesta.Localita.Coordinate.Longitudine,
                RequestKey = richiesta.Codice,
                Description = command.Motivazione,
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
