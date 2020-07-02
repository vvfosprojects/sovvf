//-----------------------------------------------------------------------
// <copyright file="AddInterventoCommandHandler.cs" company="CNVVF">
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
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Classi.Soccorso.Eventi;
using SO115App.API.Models.Classi.Soccorso.Eventi.Segnalazioni;
using SO115App.API.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestrioneIntervento.Shared.AddIntervento;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.GenerazioneCodiciRichiesta;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Competenze;
using SO115App.Models.Servizi.Infrastruttura.Turni;
using System;
using System.Collections.Generic;
using System.Linq;

namespace DomainModel.CQRS.Commands.AddIntervento
{
    public class AddInterventoCommandHandler : ICommandHandler<AddInterventoCommand>
    {
        private readonly ISaveRichiestaAssistenza _saveRichiestaAssistenza;
        private readonly IGeneraCodiceRichiesta _generaCodiceRichiesta;
        private readonly IGetTurno _getTurno;
        private readonly IGetCompetenzeByCoordinateIntervento _getCompetenze;

        public AddInterventoCommandHandler(ISaveRichiestaAssistenza saveRichiestaAssistenza,
                                           IGeneraCodiceRichiesta generaCodiceRichiesta,
                                           IGetTurno getTurno,
                                           IGetCompetenzeByCoordinateIntervento getCompetenze)
        {
            this._saveRichiestaAssistenza = saveRichiestaAssistenza;
            _generaCodiceRichiesta = generaCodiceRichiesta;
            _getTurno = getTurno;
            _getCompetenze = getCompetenze;
        }

        public void Handle(AddInterventoCommand command)
        {
            var Competenze = _getCompetenze.GetCompetenzeByCoordinateIntervento(command.Chiamata.Localita.Coordinate).ToHashSet();

            var sedeRichiesta = command.CodiceSede;
            var prioritaRichiesta = (RichiestaAssistenza.Priorita)command.Chiamata.PrioritaRichiesta;
            var codiceChiamata = _generaCodiceRichiesta.GeneraCodiceChiamata(sedeRichiesta, DateTime.UtcNow.Year);
            command.Chiamata.Codice = codiceChiamata;
            var listaCodiciTipologie = new List<string>();
            var utentiInLavorazione = new List<string>();
            var utentiPresaInCarico = new List<string>();
            foreach (var tipologia in command.Chiamata.Tipologie)
            {
                listaCodiciTipologie.Add(tipologia.Codice);
            }
            if (command.Chiamata.ListaUtentiInLavorazione != null)
            {
                foreach (var utente in command.Chiamata.ListaUtentiInLavorazione)
                {
                    utentiInLavorazione.Add(utente.Nominativo);
                }
            }
            if (command.Chiamata.ListaUtentiPresaInCarico != null)
            {
                foreach (var utente in command.Chiamata.ListaUtentiPresaInCarico)
                {
                    utentiPresaInCarico.Add(utente.Nominativo);
                }
            }

            var richiesta = new RichiestaAssistenza()
            {
                Tipologie = listaCodiciTipologie,
                CodZoneEmergenza = command.Chiamata.ZoneEmergenza,
                Richiedente = command.Chiamata.Richiedente,
                Localita = command.Chiamata.Localita,
                Descrizione = command.Chiamata.Descrizione,
                Codice = codiceChiamata,
                TrnInsChiamata = $"Turno {_getTurno.Get().Codice.Substring(0, 1)}",
                TipoTerreno = command.Chiamata.TipoTerreno,
                ObiettivoSensibile = command.Chiamata.ObiettivoSensibile,
                UtInLavorazione = utentiInLavorazione,
                UtPresaInCarico = utentiPresaInCarico,
                NotePubbliche = command.Chiamata.NotePubbliche,
                NotePrivate = command.Chiamata.NotePrivate,
                CodUOCompetenza = Competenze.ToArray(),
                CodOperatore = command.CodUtente,
                CodSOCompetente = Competenze.ToArray()[0]
            };

            if (command.Chiamata.Stato == Costanti.RichiestaChiusa)
            {
                new ChiusuraRichiesta("", richiesta, DateTime.UtcNow, command.CodUtente);
            }

            if (command.Chiamata.Tags != null)
            {
                foreach (var t in command.Chiamata.Tags)
                {
                    richiesta.Tags.Add(t);
                }
            }

            new Telefonata(richiesta, command.Chiamata.Richiedente.Telefono, DateTime.UtcNow, command.CodUtente)
            {
                NominativoChiamante = command.Chiamata.Richiedente.Nominativo,
                Motivazione = command.Chiamata.Motivazione,
                NotePrivate = command.Chiamata.NotePrivate,
                NotePubbliche = command.Chiamata.NotePubbliche,
                NumeroTelefono = command.Chiamata.Richiedente.Telefono,
                Esito = command.Chiamata.Azione.ToString(),
                CodiceSchedaContatto = command.Chiamata.CodiceSchedaNue
            };

            new AssegnazionePriorita(richiesta, prioritaRichiesta, DateTime.UtcNow.AddMilliseconds(1.0), command.CodUtente);

            if (command.Chiamata.RilevanteGrave || command.Chiamata.RilevanteStArCu)
                new MarcaRilevante(richiesta, DateTime.UtcNow.AddMilliseconds(1.5), command.CodUtente, "", command.Chiamata.RilevanteGrave,
            command.Chiamata.RilevanteStArCu);

            if (command.Chiamata.Azione.Equals(Azione.FalsoAllarme) || command.Chiamata.Azione.Equals(Azione.ChiusuraForzata) ||
                command.Chiamata.Azione.Equals(Azione.InterventoDuplicato) || command.Chiamata.Azione.Equals(Azione.InterventoNonPiuNecessario))
            {
                command.Chiamata.Stato = Costanti.RichiestaChiusa;
                new ChiusuraRichiesta("", richiesta, DateTime.UtcNow.AddMilliseconds(1.0), command.CodUtente);
            }

            this._saveRichiestaAssistenza.Save(richiesta);
        }
    }
}
