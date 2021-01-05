using CQRS.Commands;
using SO115App.Models.Classi.ServiziEsterni.AFM;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.AFM;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneIntervento.InserisciRichiestaSoccorsoAereo
{
    public class InserisciRichiestaSoccorsoAereoCommandHandler : ICommandHandler<InserisciRichiestaSoccorsoAereoCommand>
    {
        private readonly IInserisciRichiestaSoccorsoAereo _inserisci;
        private readonly IAggiornaRichiestaSoccorsoAereo _aggiorna;
        private readonly IGetRichiestaById _getRichiestaById;

        public InserisciRichiestaSoccorsoAereoCommandHandler(IInserisciRichiestaSoccorsoAereo inserisci, IAggiornaRichiestaSoccorsoAereo aggiorna, IGetRichiestaById getRichiestaById)
        {
            _inserisci = inserisci;
            _aggiorna = aggiorna;
            _getRichiestaById = getRichiestaById;
        }

        public void Handle(InserisciRichiestaSoccorsoAereoCommand command)
        {
            var richiesta = _getRichiestaById.GetByCodiceRichiesta(command.CodiceRichiesta);

            var richiestaSoccorsoAereo = new NuovaRichiestaSoccorsoAereo()
            {
                Lat = (decimal)richiesta.Localita.Coordinate.Latitudine,
                Lng = (decimal)richiesta.Localita.Coordinate.Longitudine,
                RequestKey = richiesta.Codice,
                Description = command.Motivazione
            };

            //TODO logica if
            if (true)
                _inserisci.Inserisci(richiestaSoccorsoAereo);
            else
                _aggiorna.Aggiorna(richiestaSoccorsoAereo);
        }
    }
}
