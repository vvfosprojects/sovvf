﻿using CQRS.Commands;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Classi.ServiziEsterni.Utility;
using SO115App.Models.Classi.Soccorso.Eventi;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.GenerazioneCodiciRichiesta;
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
        private readonly IGeneraCodiceRichiesta _generaCodiceRichiesta;

        public InserisciRichiestaSoccorsoAereoCommandHandler(IAggiornaRichiestaSoccorsoAereo aggiorna,
            IUpDateRichiestaAssistenza updateRichiesta,
            IGetCompetenzeByCoordinateIntervento getComeptenze,
            IGetDistaccamentoByCodiceSedeUC getDistaccamento,
            IGeneraCodiceRichiesta generaCodiceRichiesta)
        {
            _aggiorna = aggiorna;
            _updateRichiesta = updateRichiesta;
            _getComeptenze = getComeptenze;
            _getDistaccamento = getDistaccamento;
            _generaCodiceRichiesta = generaCodiceRichiesta;
        }

        public void Handle(InserisciRichiestaSoccorsoAereoCommand command)
        {
            var date = DateTime.Now;

            #region AFM Servizio

            //COMPONGO IL MODELLO PER AFM
            //var competenze = _getComeptenze.GetCompetenzeByCoordinateIntervento(new Coordinate((double)command.RichiestaSoccorsoAereo.lat, (double)command.RichiestaSoccorsoAereo.lng), command.CodiciSede[0].Split('.')[0]);
            //var codiceDistaccamentoCompetenza = competenze.Length > 0 ? competenze[0] : command.CodiciSede[0];

            if (command.Richiesta.CodRichiesta == null)
                command.Richiesta.CodRichiesta = _generaCodiceRichiesta.GeneraCodiceIntervento(command.Richiesta.CodSOCompetente, DateTime.UtcNow.Year);

            var SedeCompetenza = _getDistaccamento.Get(command.Richiesta.CodSOCompetente);

            command.RichiestaSoccorsoAereo.datetime = date;
            command.RichiestaSoccorsoAereo.requestKey = MapRequestKeyAFM.MapForAFM(command.RichiestaSoccorsoAereo.requestKey);
            command.RichiestaSoccorsoAereo.progressiveNumber = command.Richiesta.CodRichiesta?.Split('-')[2].TrimStart() ?? "";
            command.RichiestaSoccorsoAereo.locality = command.Richiesta.Localita.Indirizzo;
            command.RichiestaSoccorsoAereo.venueInCharge = SedeCompetenza.Result.DescDistaccamento;
            command.RichiestaSoccorsoAereo.onSiteContact = command.Richiesta.Richiedente.Nominativo;
            command.RichiestaSoccorsoAereo.onSiteContactPhoneNumber = command.Richiesta.Richiedente.Telefono;
            command.RichiestaSoccorsoAereo.requestTypeCode = "0";

            command.RichiestaSoccorsoAereo.operatorName = command.Utente.Nome;
            command.RichiestaSoccorsoAereo.operatorSurname = command.Utente.Cognome;
            command.RichiestaSoccorsoAereo.operatorFiscalCode = command.Utente.CodiceFiscale;

            try
            {
                //Comunico al servizio esterno
                var responseAFM = _aggiorna.Aggiorna(command.RichiestaSoccorsoAereo);

                string azione = "Inserimento";

                if (command.Richiesta.ListaEventi.Last() is RichiestaSoccorsoAereo && !responseAFM.IsError())
                {
                    azione = "Aggiornamento motivazione ";
                }

                #endregion AFM Servizio

                command.ResponseAFM = responseAFM;

                var note = command.ResponseAFM.GetNoteEvento(azione);
                var targa = command.ResponseAFM.GetTargaEvento();

                if (!responseAFM.IsError()) //OK INSERIMENTO
                {
                    new RichiestaSoccorsoAereo(command.Richiesta, date, command.IdOperatore, note, targa, command.ResponseAFM.Locality);
                    _updateRichiesta.UpDate(command.Richiesta);
                }
                else //ERRORE INSERIMENTO
                {
                    new RichiestaSoccorsoAereo(command.Richiesta, date, command.IdOperatore, note, targa);
                    _updateRichiesta.UpDate(command.Richiesta);

                    throw new Exception($"Inserimento richiesta soccorso aereo fallito: {command.ResponseAFM.errors[0].detail} ");
                }
            }catch (Exception ex)
            {
                throw new Exception($"Inserimento richiesta soccorso aereo fallito: {ex.Message} ");
            }
        }
    }
}
