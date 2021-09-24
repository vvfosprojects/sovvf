using CQRS.Commands;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Classi.ServiziEsterni.Utility;
using SO115App.Models.Classi.Soccorso.Eventi;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.AFM;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Competenze;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using System;
using System.Linq;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneIntervento.InserisciRichiestaSoccorsoAereo
{
    public class InserisciRichiestaSoccorsoAereoCommandHandler : ICommandHandler<InserisciRichiestaSoccorsoAereoCommand>
    {
        private readonly IAggiornaRichiestaSoccorsoAereo _aggiorna;
        private readonly IUpDateRichiestaAssistenza _updateRichiesta;
        private readonly IGetCompetenzeByCoordinateIntervento _getComeptenze;
        private readonly IGetDistaccamentoByCodiceSedeUC _getDistaccamento;

        public InserisciRichiestaSoccorsoAereoCommandHandler(IAggiornaRichiestaSoccorsoAereo aggiorna,
            IUpDateRichiestaAssistenza updateRichiesta,
            IGetCompetenzeByCoordinateIntervento getComeptenze,
            IGetDistaccamentoByCodiceSedeUC getDistaccamento)
        {
            _aggiorna = aggiorna;
            _updateRichiesta = updateRichiesta;
            _getComeptenze = getComeptenze;
            _getDistaccamento = getDistaccamento;
        }

        public void Handle(InserisciRichiestaSoccorsoAereoCommand command)
        {
            var date = DateTime.Now;

            #region AFM Servizio

            //COMPONGO IL MODELLO PER AFM
            var codiceDistaccamentoCompetenza = _getComeptenze.GetCompetenzeByCoordinateIntervento(new Coordinate((double)command.RichiestaSoccorsoAereo.lat, (double)command.RichiestaSoccorsoAereo.lng))[0];
            var distaccamentoCompetenza = _getDistaccamento.Get(codiceDistaccamentoCompetenza);
            command.RichiestaSoccorsoAereo.datetime = date;
            command.RichiestaSoccorsoAereo.requestKey = MapRequestKeyAFM.MapForAFM(command.RichiestaSoccorsoAereo.requestKey);
            command.RichiestaSoccorsoAereo.progressiveNumber = command.Richiesta.CodRichiesta?.Split('-')[2].TrimStart() ?? "";
            command.RichiestaSoccorsoAereo.locality = command.Richiesta.Localita.Indirizzo;
            command.RichiestaSoccorsoAereo.venueInCharge = distaccamentoCompetenza.Result.DescDistaccamento;
            command.RichiestaSoccorsoAereo.onSiteContact = command.Richiesta.Richiedente.Nominativo;
            command.RichiestaSoccorsoAereo.onSiteContactPhoneNumber = command.Richiesta.Richiedente.Telefono;
            command.RichiestaSoccorsoAereo.requestTypeCode = "0";

            //Comunico al servizio esterno
            var responseAFM = _aggiorna.Aggiorna(command.RichiestaSoccorsoAereo);

            string azione = "Inserimento";

            if (command.Richiesta.ListaEventi.Last() is RichiestaSoccorsoAereo && !responseAFM.IsError())
            {
                azione = "Aggiornamento motivazione ";
            }

            #endregion

            command.ResponseAFM = responseAFM;

            if (!responseAFM.IsError()) //OK INSERIMENTO
            {
                new RichiestaSoccorsoAereo(command.Richiesta, date, command.IdOperatore, command.ResponseAFM.GetNoteEvento(azione), command.ResponseAFM.GetTargaEvento(), command.ResponseAFM.locality);
            }
            else //ERRORE INSERIMENTO
            {
                new RichiestaSoccorsoAereo(command.Richiesta, date, command.IdOperatore, command.ResponseAFM.GetNoteEvento(azione), command.ResponseAFM.GetTargaEvento(), command.ResponseAFM.locality);
            }

            //Salvo richiesta sul db
            _updateRichiesta.UpDate(command.Richiesta);
        }
    }
}
