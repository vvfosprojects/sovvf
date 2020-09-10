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
using CQRS.Authorization;
using CQRS.Commands;
using DomainModel.CQRS.Commands.ConfermaPartenze;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Classi.Soccorso.Eventi;
using SO115App.API.Models.Classi.Soccorso.Eventi.Partenze;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Classi.Soccorso;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.GenerazioneCodiciRichiesta;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata;

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
        private readonly IGetUtenteById _getUtenteById;
        private readonly IGetStatoMezzi _getStatoMezzi;

        public ConfermaPartenzeCommandHandler(IUpdateConfermaPartenze updateConfermaPartenze, IGetRichiestaById getRichiestaById,
            IGeneraCodiceRichiesta generaCodiceRichiesta, IUpDateRichiestaAssistenza updateRichiestaAssistenza, IGetUtenteById getUtenteById, IGetStatoMezzi getStatoMezzi)
        {
            _updateConfermaPartenze = updateConfermaPartenze;
            _getRichiestaById = getRichiestaById;
            _generaCodiceRichiesta = generaCodiceRichiesta;
            _updateRichiestaAssistenza = updateRichiestaAssistenza;
            _getUtenteById = getUtenteById;
            _getStatoMezzi = getStatoMezzi;
        }

        /// <summary>
        ///   Query che estrae i valori dei Box presenti in Home Page
        /// </summary>
        /// <param name="command">Filtri utilizzati per l'estrazione</param>
        /// <returns>Elenco dei mezzi disponibili</returns>
        public void Handle(ConfermaPartenzeCommand command)
        {
            /// preparazione del DTO
            var richiesta = _getRichiestaById.GetByCodice(command.ConfermaPartenze.IdRichiesta);
            var richiestaDaSganciare = new RichiestaAssistenza();
            var utente = _getUtenteById.GetUtenteByCodice(command.ConfermaPartenze.IdOperatore);

            var stato_mezzo = _getStatoMezzi.Get(command.ConfermaPartenze.CodiceSede);

            foreach (var partenza in command.ConfermaPartenze.Partenze)
            {
                var listaMezzi = _getStatoMezzi.Get(command.ConfermaPartenze.CodiceSede, partenza.Mezzo.Codice);
                if (listaMezzi.Count > 0)
                {
                    if (listaMezzi[0].IdOpPrenotazione != null && !listaMezzi[0].IdOpPrenotazione.Equals(command.ConfermaPartenze.IdOperatore))
                        throw new Exception(Costanti.MezzoErroreGiaOccupato);
                }
            }

            var attivita = new AttivitaUtente();
            var idComposizioneDaSganciare = 0;
            var StatoInViaggio = 0;
            var StatoSulPosto = 0;

            bool PartenzaEsistente = false;
            foreach (var partenza in command.ConfermaPartenze.Partenze)
            {
                PartenzaEsistente = richiesta.Partenze.Select(x => x.Partenza.Mezzo.Codice.Equals(partenza.Mezzo.Codice) && !x.Partenza.Terminata && !x.Partenza.PartenzaAnnullata && !x.Partenza.Sganciata).FirstOrDefault();

                if (PartenzaEsistente)
                    throw new Exception(Costanti.PartenzaGiaPresente);
            }

            #region SGANCIAMENTO

            if (command.ConfermaPartenze.IdRichiestaDaSganciare != null)
            {
                richiestaDaSganciare = _getRichiestaById.GetByCodice(command.ConfermaPartenze.IdRichiestaDaSganciare);

                foreach (var composizione in richiestaDaSganciare.Eventi.Where(x => x is ComposizionePartenze).ToList())
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

                foreach (var composizione in richiestaDaSganciare.Partenze)
                {
                    if (composizione.Partenza.Mezzo.Codice.Equals(command.ConfermaPartenze.IdMezzoDaSganciare))
                        composizione.Partenza.Sganciata = true;
                }

                if (idComposizioneDaSganciare == 1)
                    richiestaDaSganciare.SincronizzaStatoRichiesta(Costanti.RichiestaSospesa, richiestaDaSganciare.StatoRichiesta, richiestaDaSganciare.CodOperatore, "", DateTime.UtcNow);
                else
                {
                    if (StatoSulPosto > 0)
                        richiestaDaSganciare.SincronizzaStatoRichiesta(Costanti.RichiestaPresidiata, richiestaDaSganciare.StatoRichiesta, richiestaDaSganciare.CodOperatore, "", DateTime.UtcNow);
                    else if (StatoInViaggio > 0)
                        richiestaDaSganciare.SincronizzaStatoRichiesta(Costanti.RichiestaAssegnata, richiestaDaSganciare.StatoRichiesta, richiestaDaSganciare.CodOperatore, "", DateTime.UtcNow);
                }

                //new RevocaPerRiassegnazione(richiesta, richiestaDaSganciare, command.ConfermaPartenze.IdMezzoDaSganciare, DateTime.UtcNow, richiesta.CodOperatore);
                _updateRichiestaAssistenza.UpDate(richiestaDaSganciare);
            }

            #endregion SGANCIAMENTO

            if (richiesta.Eventi.Where(x => x is InizioPresaInCarico).ToList().Count == 0)
                new InizioPresaInCarico(richiesta, DateTime.UtcNow, utente.Id);

            foreach (var partenza in command.ConfermaPartenze.Partenze)
            {
                //partenza.Mezzo.Stato = Costanti.MezzoInUscita;
                partenza.Sganciata = false;
                new ComposizionePartenze(richiesta, DateTime.UtcNow, utente.Id, false)
                {
                    Partenza = partenza
                };
            }

            richiesta.SincronizzaStatoRichiesta(Costanti.RichiestaAssegnata, richiesta.StatoRichiesta, utente.Id, "", DateTime.UtcNow);

            //richiesta.Id = command.ConfermaPartenze.IdRichiesta;
            command.ConfermaPartenze.richiesta = richiesta;

            var sedeRichiesta = richiesta.CodSOCompetente;

            if (richiesta.CodRichiesta == null)
                richiesta.CodRichiesta = _generaCodiceRichiesta.Genera(sedeRichiesta, DateTime.UtcNow.Year);

            foreach (var partenza in command.ConfermaPartenze.Partenze)
            {
                partenza.Mezzo.IdRichiesta = richiesta.CodRichiesta;
            }
            var nominativo = utente.Nome + "." + utente.Cognome;

            if (richiesta.UtPresaInCarico != null)
            {
                richiesta.UtPresaInCarico.Add(nominativo);
            }
            else
            {
                richiesta.UtPresaInCarico = new List<String>
                {
                    nominativo
                };
            }

            foreach (var partenze in command.ConfermaPartenze.Partenze)
            {
                foreach (var squadra in partenze.Squadre)
                {
                    squadra.Stato = MappaStatoSquadraDaStatoMezzo.MappaStato(partenze.Mezzo.Stato);
                }
            }

            command.ConfermaPartenze.IdRichiesta = richiesta.Id;

            var confermaPartenze = _updateConfermaPartenze.Update(command);

            command.ConfermaPartenze.CodiceSede = confermaPartenze.CodiceSede;
        }
    }
}
