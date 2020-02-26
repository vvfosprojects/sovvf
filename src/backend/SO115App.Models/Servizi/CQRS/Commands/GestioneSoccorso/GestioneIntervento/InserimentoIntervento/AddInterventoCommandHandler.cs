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
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.GenerazioneCodiciRichiesta;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Competenze;
using SO115App.Models.Servizi.Infrastruttura.Turni;
using System;
using System.Collections.Generic;

namespace DomainModel.CQRS.Commands.AddIntervento
{
    public class AddInterventoCommandHandler : ICommandHandler<AddInterventoCommand>
    {
        private readonly ISaveRichiestaAssistenza _saveRichiestaAssistenza;
        private readonly IGeneraCodiceRichiesta _generaCodiceRichiesta;
        private readonly IGetTurno _getTurno;
        private readonly IGetCompetenzeRichiesta _getCompetenze;

        public AddInterventoCommandHandler(ISaveRichiestaAssistenza saveRichiestaAssistenza, IGeneraCodiceRichiesta generaCodiceRichiesta, IGetTurno getTurno, IGetCompetenzeRichiesta getCompetenze)
        {
            this._saveRichiestaAssistenza = saveRichiestaAssistenza;
            _generaCodiceRichiesta = generaCodiceRichiesta;
            _getTurno = getTurno;
            _getCompetenze = getCompetenze;
        }

        public void Handle(AddInterventoCommand command)
        {
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

            string Indirizzo = "";
            string Civico = "";
            int provaCap;
            string Citta = "";
            //Se è presente il civico è lungo 4, altrimenti è lungo 3
            if (command.Chiamata.Localita.Indirizzo.Split(',').Length == 4)
            {
                Indirizzo = command.Chiamata.Localita.Indirizzo.Split(',')[0];
                Civico = command.Chiamata.Localita.Indirizzo.Split(',')[1];
                Citta = int.TryParse(command.Chiamata.Localita.Indirizzo.Split(',')[2].TrimStart().Split(' ')[0], out provaCap) ? command.Chiamata.Localita.Indirizzo.Split(',')[2].Split(' ')[2] : command.Chiamata.Localita.Indirizzo.Split(',')[2][0..^2];
            }
            else
            {
                Indirizzo = command.Chiamata.Localita.Indirizzo.Split(',')[0];
                var isCap = int.TryParse(command.Chiamata.Localita.Indirizzo.Split(',')[2].Split(' ')[0], out provaCap);
                Citta = isCap ? command.Chiamata.Localita.Indirizzo.Split(',')[1].Split(' ')[1][0..^2] : command.Chiamata.Localita.Indirizzo.Split(',')[1][0..^2];
                Civico = "0";
            }

            var Competenza = _getCompetenze.GetCompetenzeRichiesta(command.CodiceSede.Split('.')[0], Indirizzo, Civico, Citta);

            string[] CodUOCompetenzaAppo = {
                command.CodiceSede.Split('.')[0] + "." + Competenza.CodDistaccamento,
                command.CodiceSede.Split('.')[0] + "." + Competenza.CodDistaccamento2,
                command.CodiceSede.Split('.')[0] + "." + Competenza.CodDistaccamento3
            };

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
                //CodEntiIntervenuti = command.Chiamata.ListaEntiIntervenuti, TODO
                ObiettivoSensibile = command.Chiamata.ObiettivoSensibile,
                UtInLavorazione = utentiInLavorazione,
                UtPresaInCarico = utentiPresaInCarico,
                NotePubbliche = command.Chiamata.NotePubbliche,
                NotePrivate = command.Chiamata.NotePrivate,
                CodUOCompetenza = CodUOCompetenzaAppo
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
            };

            new AssegnazionePriorita(richiesta, prioritaRichiesta, DateTime.UtcNow.AddMilliseconds(1.0), command.CodUtente);

            if (command.Chiamata.RilevanteGrave || command.Chiamata.RilevanteStArCu)
                new MarcaRilevante(richiesta, DateTime.UtcNow.AddMilliseconds(1.5), command.CodUtente, "", command.Chiamata.RilevanteGrave,
            command.Chiamata.RilevanteStArCu);

            this._saveRichiestaAssistenza.Save(richiesta);
        }
    }
}
