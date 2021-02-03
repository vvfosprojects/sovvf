//-----------------------------------------------------------------------
// <copyright file="MezzoPrenotatoQueryHandler.cs" company="CNVVF">
// Copyright (C) 2017 - CNVVF
//
// This file is part of SOVVF.
// SOVVF is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// SOVVF is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see http://www.gnu.org/licenses/.
// </copyright>
//-----------------------------------------------------------------------
using CQRS.Commands;
using DomainModel.CQRS.Commands.ConfermaPartenze;
using SO115App.API.Models.Classi.Soccorso.Eventi.Partenze;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.GenerazioneCodiciRichiesta;
using System;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.ConfermaPartenze
{
    /// <summary>
    ///   Servizio che restituisce tutti i valori dei Box presenti in HomePage.
    /// </summary>
    public class ConfermaPartenzeCommandHandler : ICommandHandler<ConfermaPartenzeCommand>
    {
        private readonly IUpdateConfermaPartenze _updateConfermaPartenze;
        private readonly IUpDateRichiestaAssistenza _updateRichiestaAssistenza;
        private readonly IGetRichiestaById _getRichiestaById;
        private readonly IGeneraCodiceRichiesta _generaCodiceRichiesta;
        private readonly IGetStatoMezzi _getStatoMezzi;

        public ConfermaPartenzeCommandHandler(IUpdateConfermaPartenze updateConfermaPartenze, IGetRichiestaById getRichiestaById,
            IGeneraCodiceRichiesta generaCodiceRichiesta, IUpDateRichiestaAssistenza updateRichiestaAssistenza, IGetStatoMezzi getStatoMezzi)
        {
            _updateConfermaPartenze = updateConfermaPartenze;
            _getRichiestaById = getRichiestaById;
            _generaCodiceRichiesta = generaCodiceRichiesta;
            _updateRichiestaAssistenza = updateRichiestaAssistenza;
            _getStatoMezzi = getStatoMezzi;
        }

        /// <summary>
        ///   Query che estrae i valori dei Box presenti in Home Page
        /// </summary>
        /// <param name="command">Filtri utilizzati per l'estrazione</param>
        /// <returns>Elenco dei mezzi disponibili</returns>
        public void Handle(ConfermaPartenzeCommand command)
        {
            //PREPARAZIONE DTO E VARIABILI
            command.ConfermaPartenze.richiesta = command.Richiesta;

            var dataAdesso = DateTime.UtcNow;
            var PartenzaEsistente = false;

            foreach (var partenza in command.ConfermaPartenze.Partenze)
            {
                //CHECK MEZZO OCCUPATO E PARTENZE ESISTENTI
                var listaMezzi = _getStatoMezzi.Get(new string[] { command.ConfermaPartenze.CodiceSede }, partenza.Mezzo.Codice);
                if (listaMezzi.Count > 0)
                {
                    if (listaMezzi[0].IdOpPrenotazione != null && !listaMezzi[0].IdOpPrenotazione.Equals(command.ConfermaPartenze.IdOperatore))
                        throw new Exception(Costanti.MezzoErroreGiaOccupato);
                }

                PartenzaEsistente = command.Richiesta.Partenze.Select(x => x.Partenza.Mezzo.Codice.Equals(partenza.Mezzo.Codice) && !x.Partenza.Terminata && !x.Partenza.PartenzaAnnullata && !x.Partenza.Sganciata).FirstOrDefault();

                if (PartenzaEsistente)
                    throw new Exception(Costanti.PartenzaGiaPresente);

                //GESTISCO STATI, EVENTI E PARTENZE
                command.Richiesta.CambiaStatoPartenza(partenza, new CambioStatoMezzo()
                {
                    CodMezzo = partenza.Mezzo.Codice,
                    DataOraAggiornamento = dataAdesso,
                    Stato = Costanti.MezzoInUscita
                });

                command.Richiesta.CambiaStatoPartenza(partenza, new CambioStatoMezzo()
                {
                    CodMezzo = partenza.Mezzo.Codice,
                    DataOraAggiornamento = dataAdesso.AddMinutes(1),
                    Stato = Costanti.MezzoInViaggio
                });

                dataAdesso.AddSeconds(1);
            }

            #region SGANCIAMENTO

            var idComposizioneDaSganciare = 0;
            var StatoInViaggio = 0;
            var StatoSulPosto = 0;

            if (command.ConfermaPartenze.IdRichiestaDaSganciare != null)
            {
                command.RichiestaDaSganciare = _getRichiestaById.GetByCodice(command.ConfermaPartenze.IdRichiestaDaSganciare);

                foreach (var composizione in command.RichiestaDaSganciare.Eventi.Where(x => x is ComposizionePartenze).ToList())
                {
                    var CompPartenza = ((ComposizionePartenze)composizione).Partenza;
                    if (!CompPartenza.PartenzaAnnullata && !CompPartenza.Terminata
                        && !CompPartenza.Sganciata && !CompPartenza.Mezzo.Stato.Equals(Costanti.MezzoInRientro))
                    {
                        if (CompPartenza.Mezzo.Codice.Equals(command.ConfermaPartenze.IdMezzoDaSganciare))
                            CompPartenza.Sganciata = true;

                        if (CompPartenza.Mezzo.Stato == Costanti.MezzoInViaggio && !CompPartenza.Mezzo.Codice.Equals(command.ConfermaPartenze.IdMezzoDaSganciare))
                            StatoInViaggio++;

                        if (CompPartenza.Mezzo.Stato == Costanti.MezzoSulPosto && !CompPartenza.Mezzo.Codice.Equals(command.ConfermaPartenze.IdMezzoDaSganciare))
                            StatoSulPosto++;

                        idComposizioneDaSganciare++;
                    }
                }

                foreach (var composizione in command.RichiestaDaSganciare.Partenze)
                {
                    if (composizione.Partenza.Mezzo.Codice.Equals(command.ConfermaPartenze.IdMezzoDaSganciare))
                        composizione.Partenza.Sganciata = true;
                }

                if (idComposizioneDaSganciare == 1)
                    command.RichiestaDaSganciare.SincronizzaStatoRichiesta(Costanti.RichiestaSospesa, command.RichiestaDaSganciare.StatoRichiesta, command.RichiestaDaSganciare.CodOperatore, "", dataAdesso);
                else
                {
                    if (StatoSulPosto > 0)
                        command.RichiestaDaSganciare.SincronizzaStatoRichiesta(Costanti.RichiestaPresidiata, command.RichiestaDaSganciare.StatoRichiesta, command.RichiestaDaSganciare.CodOperatore, "", dataAdesso);
                    else if (StatoInViaggio > 0)
                        command.RichiestaDaSganciare.SincronizzaStatoRichiesta(Costanti.RichiestaAssegnata, command.RichiestaDaSganciare.StatoRichiesta, command.RichiestaDaSganciare.CodOperatore, "", dataAdesso);
                }

                //new RevocaPerRiassegnazione(richiesta, richiestaDaSganciare, command.ConfermaPartenze.IdMezzoDaSganciare, DateTime.UtcNow, richiesta.CodOperatore);
                _updateRichiestaAssistenza.UpDate(command.RichiestaDaSganciare);
            }

            #endregion SGANCIAMENTO


            //GENERAZIONE CODICE INTERVENTO
            var sedeRichiesta = command.Richiesta.CodSOCompetente;

            if (command.Richiesta.CodRichiesta == null)
                command.Richiesta.CodRichiesta = _generaCodiceRichiesta.GeneraCodiceIntervento(sedeRichiesta, dataAdesso.Year);


            //GESTIONE UTENTE PRESA IN CARICO
            var nominativo = command.Utente.Nome + "." + command.Utente.Cognome;

            if (command.Richiesta.UtPresaInCarico != null)
                command.Richiesta.UtPresaInCarico.Add(nominativo);
            else
                command.Richiesta.UtPresaInCarico = new List<string> { nominativo };


            //GESTIONE CODICE PARTENZA
            int ContatorePartenze = 1;
            foreach (var partenza in command.Richiesta.Partenze)
            {
                if (partenza.Partenza.Codice == 0)
                    partenza.Partenza.Codice = ContatorePartenze;

                ContatorePartenze++;
            }


            //SALVO SUL DB
            var confermaPartenze = _updateConfermaPartenze.Update(command);
        }
    }
}
