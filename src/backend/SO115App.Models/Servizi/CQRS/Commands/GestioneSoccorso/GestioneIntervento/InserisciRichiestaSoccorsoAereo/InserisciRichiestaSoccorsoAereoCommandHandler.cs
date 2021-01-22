using CQRS.Commands;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Classi.ServiziEsterni.Utility;
using SO115App.Models.Classi.Soccorso.Eventi;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.AFM;
using System;
using System.Linq;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneIntervento.InserisciRichiestaSoccorsoAereo
{
    public class InserisciRichiestaSoccorsoAereoCommandHandler : ICommandHandler<InserisciRichiestaSoccorsoAereoCommand>
    {
        private readonly IAggiornaRichiestaSoccorsoAereo _aggiorna;
        private readonly IUpDateRichiestaAssistenza _updateRichiesta;

        public InserisciRichiestaSoccorsoAereoCommandHandler(IAggiornaRichiestaSoccorsoAereo aggiorna, IUpDateRichiestaAssistenza updateRichiesta)
        {
            _aggiorna = aggiorna;
            _updateRichiesta = updateRichiesta;
        }

        public void Handle(InserisciRichiestaSoccorsoAereoCommand command)
        {
            var date = DateTime.Now;

            #region AFM Servizio

            //COMPONGO IL MODELLO DEL SERVIZIO ESTERNO
            command.RichiestaSoccorsoAereo.datetime = date;

            if (command.RichiestaSoccorsoAereo.requestKey != null)
                command.RichiestaSoccorsoAereo.requestKey = MapRequestKeyAFM.MapForAFM(command.RichiestaSoccorsoAereo.requestKey);

            //Comunico al servizio esterno
            var responseAFM = _aggiorna.Aggiorna(command.RichiestaSoccorsoAereo);

            #endregion

            command.ResponseAFM = responseAFM;

            if (responseAFM.IsError()) //ERRORE
            {
                new RichiestaSoccorsoAereo(command.Richiesta, date, command.IdOperatore, string.Concat(responseAFM.errors.Select(e => MapErrorsAFM.Map(e))), responseAFM.activities);
            }
            else //OK INSERIMENTO
            {
                var note = "Richiesta AFM accettata: " + responseAFM.activities.LastOrDefault().activityStatusType;

                new RichiestaSoccorsoAereo(command.Richiesta, date, command.IdOperatore, note, responseAFM.activities);

                command.Richiesta.RichiestaSoccorsoAereo = true;
            }

            //Salvo richiesta sul db
            _updateRichiesta.UpDate(command.Richiesta);
        }
    }
}
