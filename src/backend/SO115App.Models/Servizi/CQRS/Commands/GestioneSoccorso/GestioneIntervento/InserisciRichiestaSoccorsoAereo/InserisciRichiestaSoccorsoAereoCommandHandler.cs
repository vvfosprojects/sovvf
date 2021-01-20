﻿using CQRS.Commands;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
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
            {
                string value = command.Richiesta.Codice;
                string sede = value.Split('-', StringSplitOptions.RemoveEmptyEntries)[0];
                string seq = value.Split('-', StringSplitOptions.RemoveEmptyEntries)[2].TrimStart('0');
                string data = value.Split('-', StringSplitOptions.RemoveEmptyEntries)[1];

                seq = seq == "" ? "0" : seq;

                command.RichiestaSoccorsoAereo.requestKey = "CMD." + sede + '.' + seq + '.' + data;
            }

            //Comunico al servizio esterno
            var responseAFM = _aggiorna.Aggiorna(command.RichiestaSoccorsoAereo);

            #endregion

            command.ResponseAFM = responseAFM;

            if (responseAFM.IsError()) //ERRORE
            {
                new RichiestaSoccorsoAereo(command.Richiesta, date, command.IdOperatore, string.Concat(responseAFM.errors.Select(e => e.detail)));
            }
            else //OK INSERIMENTO
            {
                var note = "Richiesta accettata: " + responseAFM.activities.LastOrDefault().activityStatusType;

                new RichiestaSoccorsoAereo(command.Richiesta, date, command.IdOperatore, note);

                command.Richiesta.RichiestaSoccorsoAereo = true;

                command.Richiesta.SincronizzaStatoRichiesta(Costanti.RichiestaAssegnata, command.Richiesta.StatoRichiesta, command.IdOperatore, command.RichiestaSoccorsoAereo.description, date);
            }

            //Salvo richiesta sul db
            _updateRichiesta.UpDate(command.Richiesta);
        }
    }
}
