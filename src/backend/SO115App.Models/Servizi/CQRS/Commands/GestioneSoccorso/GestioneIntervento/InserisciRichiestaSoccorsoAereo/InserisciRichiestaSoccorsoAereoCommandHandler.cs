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

            if (command.RichiestaSoccorsoAereo.requestKey != null)
            {
                string value = command.Richiesta.Codice;
                string sede = value.Split('-', StringSplitOptions.RemoveEmptyEntries)[0];
                string seq = value.Split('-', StringSplitOptions.RemoveEmptyEntries)[2].TrimStart('0');
                string data = value.Split('-', StringSplitOptions.RemoveEmptyEntries)[1];

                seq = seq == "" ? "0" : seq;

                command.RichiestaSoccorsoAereo.requestKey = "CMD." + sede + '.' + seq + '.' + data;
            }

            command.RichiestaSoccorsoAereo.datetime = DateTime.Now;

            //Comunico al servizio esterno
            _aggiorna.Aggiorna(command.RichiestaSoccorsoAereo);

            //Aggiorno richiesta sul db
            _saveRichiestaAssistenza.Save(command.Richiesta);
        }
    }
}
