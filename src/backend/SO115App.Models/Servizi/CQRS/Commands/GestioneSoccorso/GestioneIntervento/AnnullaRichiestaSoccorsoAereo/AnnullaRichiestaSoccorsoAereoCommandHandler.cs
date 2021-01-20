using CQRS.Commands;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Classi.ServiziEsterni.Utility;
using SO115App.Models.Classi.Soccorso.Eventi;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.AFM;
using System;
using System.Linq;

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
            var date = DateTime.Now;

            #region AFM Servizio

            //Comunico al servizio esterno
            var result = _annullaRichiestaSoccorsoAereo.Annulla(command.Annullamento, command.Codice);

            #endregion

            command.ErroriAFM = result;

            if (!result.IsError()) //OK ANNULLAMENTO
            {
                command.Richiesta.RichiestaSoccorsoAereo = false;

                new AnnullamentoRichiestaSoccorsoAereo(command.Richiesta, date, command.IdOperatore, "Annullamento AFM accettato");
            }
            else //FALLIMENTO ANNULLAMENTO
            {
                new AnnullamentoRichiestaSoccorsoAereo(command.Richiesta, date, command.IdOperatore, string.Concat(result.errors.Select(e => MapErrorsAFM.Map(e))));
            }

            //Salvo richiesta sul db
            _updateRichiesta.UpDate(command.Richiesta);
        }
    }
}
