using CQRS.Commands;
using SO115App.Models.Classi.Soccorso.Eventi;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.AFM;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneIntervento.AnnullaRichiestaSoccorsoAereo
{
    public class AnnullaRichiestaSoccorsoAereoCommandHandler : ICommandHandler<AnnullaRichiestaSoccorsoAereoCommand>
    {
        private readonly IAnnullaRichiestaSoccorsoAereo _annullaRichiestaSoccorsoAereo;
        private readonly IGetRichiestaById _getRichiestaById;

        public AnnullaRichiestaSoccorsoAereoCommandHandler(IAnnullaRichiestaSoccorsoAereo annullaRichiestaSoccorsoAereo, IGetRichiestaById getRichiestaById)
        {
            _annullaRichiestaSoccorsoAereo = annullaRichiestaSoccorsoAereo;
            _getRichiestaById = getRichiestaById;
        }

        public void Handle(AnnullaRichiestaSoccorsoAereoCommand command)
        {
            var richiesta = _getRichiestaById.GetByCodiceRichiesta(command.Codice);

            new AnnullamentoRichiestaSoccorsoAereo(richiesta, DateTime.Now, command.IdOperatore);

            _annullaRichiestaSoccorsoAereo.Annulla(command.Annullamento, command.Codice);
        }
    }
}
