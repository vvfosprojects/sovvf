﻿//-----------------------------------------------------------------------
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
using Serilog;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Classi.Soccorso.Eventi;
using SO115App.API.Models.Classi.Soccorso.Eventi.Segnalazioni;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.GenerazioneCodiciRichiesta;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue;
using SO115App.Models.Servizi.Infrastruttura.Turni;
using System;
using System.Collections.Generic;
using System.Linq;
using static SO115App.API.Models.Classi.Soccorso.RichiestaAssistenza;

namespace DomainModel.CQRS.Commands.AddIntervento
{
    public class AddInterventoCommandHandler : ICommandHandler<AddInterventoCommand>
    {
        private readonly ISaveRichiestaAssistenza _saveRichiestaAssistenza;
        private readonly IGeneraCodiceRichiesta _generaCodiceRichiesta;
        private readonly IGetTurno _getTurno;
        private readonly ISetStatoGestioneSchedaContatto _setStatoGestioneSchedaContatto;
        private readonly IGetUtenteById _getUtenteById;

        public AddInterventoCommandHandler(ISaveRichiestaAssistenza saveRichiestaAssistenza,
                                           IGeneraCodiceRichiesta generaCodiceRichiesta,
                                           IGetTurno getTurno,
                                           ISetStatoGestioneSchedaContatto setStatoGestioneSchedaContatto,
                                           IGetUtenteById getUtenteById)
        {
            _saveRichiestaAssistenza = saveRichiestaAssistenza;
            _generaCodiceRichiesta = generaCodiceRichiesta;
            _getTurno = getTurno;
            _setStatoGestioneSchedaContatto = setStatoGestioneSchedaContatto;
            _getUtenteById = getUtenteById;
        }

        public void Handle(AddInterventoCommand command)
        {
            Log.Information("Inserimento Intervento - Inizio scrittura internvento");

            command.Chiamata.Codice = _generaCodiceRichiesta.GeneraCodiceChiamata(command.CodiceSede, DateTime.UtcNow.Year);

            var listaCodiciTipologie = command.Chiamata.Tipologie?.Select(t => t.Codice).ToList();
            var utentiInLavorazione = command.Chiamata.ListaUtentiInLavorazione?.Select(u => u.Nominativo).ToList();
            var utentiPresaInCarico = command.Chiamata.ListaUtentiPresaInCarico?.Select(u => u.Nominativo).ToList();

            command.Chiamata.Localita.SplitIndirizzo();
            var richiesta = new RichiestaAssistenza()
            {
                Tipologie = command.Chiamata.Tipologie,
                Richiedente = command.Chiamata.Richiedente,
                Localita = command.Chiamata.Localita,
                Descrizione = command.Chiamata.Descrizione,
                Codice = command.Chiamata.Codice,
                TrnInsChiamata = _getTurno.Get().Codice,
                TipoTerreno = command.Chiamata.TipoTerreno,
                ObiettivoSensibile = command.Chiamata.ObiettivoSensibile,
                UtInLavorazione = utentiInLavorazione,
                UtPresaInCarico = utentiPresaInCarico,
                NotePubbliche = command.Chiamata.NotePubbliche,
                NotePrivate = command.Chiamata.NotePrivate,
                CodUOCompetenza = command.CodCompetenze != null ? command.CodCompetenze.ToArray() : null,
                Competenze = command.Chiamata.Competenze,
                CodOperatore = command.CodUtente,
                CodSOCompetente = command.CodiceSede,
                CodEntiIntervenuti = command.Chiamata.listaEnti?.Select(c => c).ToList(),
                DettaglioTipologia = command.Chiamata.DettaglioTipologia,
                TriageSummary = command.Chiamata.TriageSummary,
                ChiamataUrgente = command.Chiamata.ChiamataUrgente,
                Esercitazione = command.Chiamata.Esercitazione,
                NoteNue = command.Chiamata.NoteNue
            };

            //Aggiungo le competenze alla chiamata per la gestione delle notifiche di CodaChiamate
            //command.Chiamata.Competenze = sedi;

            if (command.Chiamata.Tags != null)
                richiesta.Tags = new HashSet<string>(command.Chiamata.Tags);

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

            var prioritaRichiesta = command.Chiamata.PrioritaRichiesta;

            switch (prioritaRichiesta)
            {
                case 1:
                    new AssegnazionePriorita(richiesta, Priorita.Bassissima, DateTime.UtcNow, command.CodUtente);
                    break;

                case 2:
                    new AssegnazionePriorita(richiesta, Priorita.Bassa, DateTime.UtcNow, command.CodUtente);
                    break;

                case 3:
                    new AssegnazionePriorita(richiesta, Priorita.Media, DateTime.UtcNow, command.CodUtente);
                    break;

                case 4:
                    new AssegnazionePriorita(richiesta, Priorita.Alta, DateTime.UtcNow, command.CodUtente);
                    break;

                case 5:
                    new AssegnazionePriorita(richiesta, Priorita.Altissima, DateTime.UtcNow, command.CodUtente);
                    break;
            };

            if (command.Chiamata.RilevanteGrave || command.Chiamata.RilevanteStArCu)
                new MarcaRilevante(richiesta, DateTime.UtcNow, command.CodUtente, "", command.Chiamata.RilevanteGrave,

            command.Chiamata.RilevanteStArCu);

            if (command.Chiamata.CodiceSchedaNue != null)
            {
                var codiceFiscaleOperatore = _getUtenteById.GetUtenteByCodice(command.CodUtente).CodiceFiscale;
                _setStatoGestioneSchedaContatto.Gestita(command.Chiamata.CodiceSchedaNue, command.CodiceSede, codiceFiscaleOperatore, true, command.Chiamata.Codice);
            }

            _saveRichiestaAssistenza.Save(richiesta);

            //Salvo l'intervento nel command per usarlo nella notifica
            command.Intervento = richiesta;

            Log.Information("Inserimento Intervento - Fine scrittura internvento");
        }
    }
}
