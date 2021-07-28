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
using SO115App.API.Models.Classi.Soccorso.Eventi;
using SO115App.API.Models.Classi.Soccorso.Eventi.Partenze;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.GenerazioneCodiciRichiesta;
using SO115App.Models.Servizi.Infrastruttura.GestioneStatoOperativoSquadra;
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
        private readonly IGetRichiesta _getRichiestaById;
        private readonly IGeneraCodiceRichiesta _generaCodiceRichiesta;
        private readonly IGetStatoMezzi _getStatoMezzi;

        public ConfermaPartenzeCommandHandler(IUpdateConfermaPartenze updateConfermaPartenze, IGetRichiesta getRichiestaById,
            IGeneraCodiceRichiesta generaCodiceRichiesta, IUpDateRichiestaAssistenza updateRichiestaAssistenza,
            IGetStatoMezzi getStatoMezzi)
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
            var dataAdesso = DateTime.UtcNow;

            //GENERAZIONE CODICE INTERVENTO
            var sedeRichiesta = command.Richiesta.CodSOCompetente;

            if (command.Richiesta.CodRichiesta == null)
                command.Richiesta.CodRichiesta = _generaCodiceRichiesta.GeneraCodiceIntervento(sedeRichiesta, dataAdesso.Year);

            #region SGANCIAMENTO

            var idComposizioneDaSganciare = 0;
            var StatoInViaggio = 0;
            var StatoSulPosto = 0;

            if (command.ConfermaPartenze.IdRichiestaDaSganciare != null)
            //&& command.RichiestaDaSganciare.lstPartenze
            //    .Where(p => command.ConfermaPartenze.Partenze.Select(p => p.Mezzo.Codice).Contains(p.Mezzo.Codice))
            //    .All(p => new string[] { Costanti.MezzoInViaggio, Costanti.MezzoSulPosto, Costanti.MezzoOccupato }.Contains(p.Mezzo.Stato)))
            {
                command.RichiestaDaSganciare = _getRichiestaById.GetByCodice(command.ConfermaPartenze.IdRichiestaDaSganciare);

                foreach (var composizione in command.RichiestaDaSganciare.Eventi.OfType<ComposizionePartenze>().Select(p => p.Partenza))
                {
                    //var CompPartenza = composizione.Partenza;
                    if (!composizione.PartenzaAnnullata && !composizione.Terminata
                        && !composizione.Sganciata && !composizione.Mezzo.Stato.Equals(Costanti.MezzoInRientro))
                    {
                        if (composizione.Mezzo.Codice.Equals(command.ConfermaPartenze.IdMezzoDaSganciare))
                            composizione.Sganciata = true;

                        if (composizione.Mezzo.Stato == Costanti.MezzoInViaggio && !composizione.Mezzo.Codice.Equals(command.ConfermaPartenze.IdMezzoDaSganciare))
                            StatoInViaggio++;

                        if (composizione.Mezzo.Stato == Costanti.MezzoSulPosto && !composizione.Mezzo.Codice.Equals(command.ConfermaPartenze.IdMezzoDaSganciare))
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
                    command.RichiestaDaSganciare.SincronizzaStatoRichiesta(Costanti.RichiestaSospesa, command.RichiestaDaSganciare.StatoRichiesta, command.RichiestaDaSganciare.CodOperatore, "", dataAdesso, null);
                else
                {
                    if (StatoSulPosto > 0)
                        command.RichiestaDaSganciare.SincronizzaStatoRichiesta(Costanti.RichiestaPresidiata, command.RichiestaDaSganciare.StatoRichiesta, command.RichiestaDaSganciare.CodOperatore, "", dataAdesso, null);
                    else if (StatoInViaggio > 0)
                        command.RichiestaDaSganciare.SincronizzaStatoRichiesta(Costanti.RichiestaAssegnata, command.RichiestaDaSganciare.StatoRichiesta, command.RichiestaDaSganciare.CodOperatore, "", dataAdesso, null);
                }

                new RevocaPerRiassegnazione(command.RichiestaDaSganciare, command.Richiesta, command.ConfermaPartenze.IdMezzoDaSganciare, dataAdesso, command.Utente.Id,
                    command.ConfermaPartenze.Partenze.FirstOrDefault(p => p.Mezzo.Codice == command.ConfermaPartenze.IdMezzoDaSganciare).Codice);

                //SOSPENDO LA RICHIESTA SE LA PARTENZA DA SGANCIARE E' L'ULTIMA IN CORSO SU TALE RICHIESTA
                //if (command.Richiesta.lstPartenze.Where(p => !p.Terminata && !p.PartenzaAnnullata && !p.Sganciata && p.Mezzo.Codice != command.ConfermaPartenze.IdMezzoDaSganciare).Count() == 0)
                //    new RichiestaSospesa($"Scangio dell'ultima partenza {command.ConfermaPartenze.Partenze.First().Codice} sulla richiesta {command.Richiesta.Codice}", command.Richiesta, dataAdesso, command.Utente.Id);

                _updateRichiestaAssistenza.UpDate(command.RichiestaDaSganciare);
            }

            #endregion SGANCIAMENTO

            for (int i = 1; i <= command.ConfermaPartenze.Partenze.Count; i++)
                command.ConfermaPartenze.Partenze.ToArray()[i - 1].Codice = command.Richiesta.CodiceUltimaPartenza + i;

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
                if (partenza.Mezzo.IdRichiesta != null && partenza.Mezzo.IdRichiesta != command.Richiesta.Codice)
                {
                    //SE IL MEZZO E' IN RIENTRO SU UN'ALTRA RICHIESTA, FACCIO RIENTRARE LE PARTENZE E GESTISCO LA RICHIESTA
                    command.RichiestaDaSganciare = _getRichiestaById.GetById(partenza.Mezzo.IdRichiesta);

                    var partenzaDaRientrare = command.RichiestaDaSganciare.Partenze.First(p => p.Partenza.Mezzo.Codice == partenza.Mezzo.Codice).Partenza;

                    if (partenzaDaRientrare.Mezzo.Stato == Costanti.MezzoInRientro)
                    {
                        command.Richiesta.CambiaStatoPartenza(partenzaDaRientrare, new CambioStatoMezzo()
                        {
                            CodMezzo = partenzaDaRientrare.Mezzo.Codice,
                            DataOraAggiornamento = dataAdesso,
                            Stato = Costanti.MezzoRientrato
                        });

                        _updateRichiestaAssistenza.UpDate(command.RichiestaDaSganciare);
                    }
                }

                command.Richiesta.CambiaStatoPartenza(partenza, new CambioStatoMezzo()
                {
                    CodMezzo = partenza.Mezzo.Codice,
                    DataOraAggiornamento = dataAdesso,
                    Stato = Costanti.MezzoInUscita
                });

                command.Richiesta.CambiaStatoPartenza(partenza, new CambioStatoMezzo()
                {
                    CodMezzo = partenza.Mezzo.Codice,
                    DataOraAggiornamento = dataAdesso,
                    Stato = Costanti.MezzoInViaggio
                });

                dataAdesso = dataAdesso.AddSeconds(1);


            }

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
