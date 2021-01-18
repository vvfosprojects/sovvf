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
            var dataInserimento = DateTime.Now;

            //COMPONGO IL MODELLO DEL SERVIZIO ESTERNO
            command.RichiestaSoccorsoAereo.datetime = dataInserimento;

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
            var result = _aggiorna.Aggiorna(command.RichiestaSoccorsoAereo);

            //Aggiorno la richiesta
            new RichiestaSoccorsoAereo(command.Richiesta, dataInserimento, command.IdOperatore, string.Concat(result.errors.Select(e => e.detail)));
            command.Richiesta.SincronizzaStatoRichiesta(Costanti.RichiestaAssegnata, command.Richiesta.StatoRichiesta, command.IdOperatore, command.RichiestaSoccorsoAereo.description, dataInserimento);

            //Salvo richiesta sul db
            command.Richiesta.RichiestaSoccorsoAereo = true;
            _updateRichiesta.UpDate(command.Richiesta);
        }
    }
}
