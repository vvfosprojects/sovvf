using CQRS.Commands;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Classi.ServiziEsterni.Utility;
using SO115App.Models.Classi.Soccorso.Eventi;
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
            string azione = "Inserimento";

            command.RichiestaSoccorsoAereo.datetime = date;

            if (command.Richiesta.ListaEventi.Last() is RichiestaSoccorsoAereo)
            {
                azione = "Aggiornamento";
            }

            command.RichiestaSoccorsoAereo.requestKey = MapRequestKeyAFM.MapForAFM(command.RichiestaSoccorsoAereo.requestKey);

            //Comunico al servizio esterno
            var responseAFM = _aggiorna.Aggiorna(command.RichiestaSoccorsoAereo);

            #endregion

            command.ResponseAFM = responseAFM;

            if (!responseAFM.IsError()) //OK INSERIMENTO
            {
                new RichiestaSoccorsoAereo(command.Richiesta, date, command.IdOperatore, command.ResponseAFM.GetNoteEvento(azione), command.ResponseAFM.GetTargaEvento());

                command.Richiesta.RichiestaSoccorsoAereo = true;
            }
            else //ERRORE INSERIMENTO
            {
                new RichiestaSoccorsoAereo(command.Richiesta, date, command.IdOperatore, command.ResponseAFM.GetNoteEvento(azione), command.ResponseAFM.GetTargaEvento());
            }

            //Salvo richiesta sul db
            _updateRichiesta.UpDate(command.Richiesta);
        }
    }
}
