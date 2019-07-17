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
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Classi.Soccorso.Eventi;
using SO115App.API.Models.Classi.Soccorso.Eventi.Partenze;
using SO115App.Models.Classi.Soccorso;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.GenerazioneCodiciRichiesta;
using System;
using System.Collections.Generic;

namespace SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.ConfermaPartenze
{
    /// <summary>
    ///   Servizio che restituisce tutti i valori dei Box presenti in HomePage.
    /// </summary>
    public class ConfermaPartenzeCommandHandler : ICommandHandler<ConfermaPartenzeCommand>
    {
        private readonly IUpdateConfermaPartenze _IUpdateConfermaPartenze;
        private readonly IGetRichiestaById _getRichiestaById;
        private readonly IGeneraCodiceRichiesta _generaCodiceRichiesta;

        public ConfermaPartenzeCommandHandler(IUpdateConfermaPartenze iUpdateConfermaPartenze, IGetRichiestaById GetRichiestaById, IGeneraCodiceRichiesta generaCodiceRichiesta)
        {
            this._IUpdateConfermaPartenze = iUpdateConfermaPartenze;
            this._getRichiestaById = GetRichiestaById;
            this._generaCodiceRichiesta = generaCodiceRichiesta;
        }

        /// <summary>
        ///   Query che estrae i valori dei Box presenti in Home Page
        /// </summary>
        /// <param name="query">Filtri utilizzati per l'estrazione</param>
        /// <returns>Elenco dei mezzi disponibili</returns>
        public void Handle(ConfermaPartenzeCommand command)
        {
            // preparazione del DTO
            RichiestaAssistenza richiesta = _getRichiestaById.Get(command.ConfermaPartenze.IdRichiesta);
            AttivitaUtente attivita = new AttivitaUtente();

            new InizioPresaInCarico(richiesta, DateTime.UtcNow, richiesta.Operatore.Id);

            foreach (Partenza partenza in command.ConfermaPartenze.Partenze)
            {
                new ComposizionePartenze(richiesta, DateTime.UtcNow, richiesta.Operatore.Id, false)
                {
                    Partenza = partenza
                };
            }

            richiesta.SincronizzaStatoRichiesta("Assegnata", richiesta.StatoRichiesta, richiesta.Operatore.Id, "");

            richiesta.Id = command.ConfermaPartenze.IdRichiesta;
            command.ConfermaPartenze.richiesta = richiesta;

            var sedeRichiesta = command.ConfermaPartenze.richiesta.Operatore.Sede.Codice;
            var codiceRichiesta = _generaCodiceRichiesta.Genera(sedeRichiesta, DateTime.UtcNow.Year);
            richiesta.CodiceRichiesta = codiceRichiesta;

            attivita.IdUtente = command.ConfermaPartenze.richiesta.Operatore.Id;
            attivita.Nominativo = command.ConfermaPartenze.richiesta.Operatore.Nome + " " + command.ConfermaPartenze.richiesta.Operatore.Cognome;
            attivita.DataInizioAttivita = DateTime.UtcNow;

            if (richiesta.ListaUtentiPresaInCarico != null)
                richiesta.ListaUtentiPresaInCarico.Add(attivita);
            else
            {
                richiesta.ListaUtentiPresaInCarico = new List<AttivitaUtente>();
                richiesta.ListaUtentiPresaInCarico.Add(attivita);
            }

            Classi.Composizione.ConfermaPartenze confermaPartenze = _IUpdateConfermaPartenze.Update(command);

            command.ConfermaPartenze.CodiceSede = confermaPartenze.CodiceSede;
        }
    }
}
