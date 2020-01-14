//-----------------------------------------------------------------------
// <copyright file="UpDateInterventoCommandHandler.cs" company="CNVVF">
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

using System;
using System.Collections.Generic;
using CQRS.Commands;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Classi.Soccorso.Eventi;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;

namespace DomainModel.CQRS.Commands.UpDateIntervento
{
    public class UpDateInterventoCommandHandler : ICommandHandler<UpDateInterventoCommand>
    {
        private readonly IUpDateRichiestaAssistenza _updateRichiestaAssistenza;
        private readonly IGetRichiestaById _getRichiestaById;

        public UpDateInterventoCommandHandler(
            IUpDateRichiestaAssistenza updateRichiestaAssistenza,
            IGetRichiestaById getRichiestaById)
        {
            _updateRichiestaAssistenza = updateRichiestaAssistenza;
            _getRichiestaById = getRichiestaById;
        }

        public void Handle(UpDateInterventoCommand command)
        {
            var richiesta = _getRichiestaById.Get(command.Chiamata.Codice);
            var priorita = command.Chiamata.PrioritaRichiesta;
            var listaCodiciTipologie = new List<string>();
            var utentiInLavorazione = new List<string>();
            var utentiPresaInCarico = new List<string>();
            foreach (var tipologia in command.Chiamata.Tipologie)
            {
                listaCodiciTipologie.Add(tipologia.Codice);
            }
            foreach (var utente in command.Chiamata.ListaUtentiInLavorazione)
            {
                utentiInLavorazione.Add(utente.Nominativo);
            }
            foreach (var utente in command.Chiamata.ListaUtentiPresaInCarico)
            {
                utentiPresaInCarico.Add(utente.Nominativo);
            }

            richiesta.Tipologie = listaCodiciTipologie;
            richiesta.CodZoneEmergenza = command.Chiamata.ZoneEmergenza;
            richiesta.Richiedente = command.Chiamata.Richiedente;
            richiesta.Localita = command.Chiamata.Localita;
            richiesta.Descrizione = command.Chiamata.Descrizione;
            richiesta.TipoTerreno = command.Chiamata.TipoTerreno;
            richiesta.ObiettivoSensibile = command.Chiamata.ObiettivoSensibile;
            richiesta.UtInLavorazione = utentiInLavorazione;
            richiesta.UtPresaInCarico = utentiPresaInCarico;
            richiesta.NotePrivate = command.Chiamata.NotePrivate;
            richiesta.NotePubbliche = command.Chiamata.NotePubbliche;
            richiesta.Id = command.Chiamata.Codice;

            if (command.Chiamata.Tags != null)
            {
                foreach (var t in command.Chiamata.Tags)
                {
                    richiesta.Tags.Add(t);
                }
            }

            richiesta.SincronizzaRilevanza(command.Chiamata.RilevanteGrave, command.Chiamata.RilevanteStArCu, command.Chiamata.Operatore.Id, command.Chiamata.Descrizione, DateTime.UtcNow);

            richiesta.SincronizzaStatoRichiesta(command.Chiamata.Stato, richiesta.StatoRichiesta, command.Chiamata.Operatore.Id, command.Chiamata.Motivazione);

            if (richiesta.PrioritaRichiesta != command.Chiamata.PrioritaRichiesta)
            {
                new AssegnazionePriorita(richiesta, priorita, DateTime.UtcNow, command.Chiamata.Operatore.Id);
            }

            _updateRichiestaAssistenza.UpDate(richiesta);
        }
    }
}
