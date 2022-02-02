//-----------------------------------------------------------------------
// <copyright file="AddInterventoFromSurvey123CommandHandler.cs" company="CNVVF">
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
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Classi.Soccorso.Eventi;
using SO115App.API.Models.Classi.Soccorso.Eventi.Segnalazioni;
using SO115App.API.Models.Servizi.CQRS.Command.GestioneSoccorso.Shared;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Classi.ServiziEsterni.Utility;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.GenerazioneCodiciRichiesta;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Competenze;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue;
using SO115App.Models.Servizi.Infrastruttura.Turni;
using System;
using System.Collections.Generic;
using System.Linq;

namespace DomainModel.CQRS.Commands.AddInterventoFromSurvey123
{
    public class AddInterventoFromSurvey123CommandHandler : ICommandHandler<AddInterventoFromSurvey123Command>
    {
        private readonly ISaveRichiestaAssistenza _saveRichiestaAssistenza;
        private readonly IGeneraCodiceRichiesta _generaCodiceRichiesta;
        private readonly IGetTurno _getTurno;
        private readonly IGetDistaccamentoByCodiceSedeUC _getDistaccamento;
        private readonly ISetStatoGestioneSchedaContatto _setStatoGestioneSchedaContatto;
        private readonly IGetUtenteById _getUtenteById;
        private readonly IGetCompetenzeByCoordinateIntervento _getCompetenze;

        public AddInterventoFromSurvey123CommandHandler(ISaveRichiestaAssistenza saveRichiestaAssistenza,
                                           IGeneraCodiceRichiesta generaCodiceRichiesta,
                                           IGetTurno getTurno,
                                           IGetCompetenzeByCoordinateIntervento getCompetenze,
                                           IGetDistaccamentoByCodiceSedeUC getDistaccamento,
                                           ISetStatoGestioneSchedaContatto setStatoGestioneSchedaContatto,
                                           IGetUtenteById getUtenteById)
        {
            _saveRichiestaAssistenza = saveRichiestaAssistenza;
            _generaCodiceRichiesta = generaCodiceRichiesta;
            _getTurno = getTurno;
            _getCompetenze = getCompetenze;
            _getDistaccamento = getDistaccamento;
            _setStatoGestioneSchedaContatto = setStatoGestioneSchedaContatto;
            _getUtenteById = getUtenteById;
        }

        public void Handle(AddInterventoFromSurvey123Command command)
        {
            List<Tipologia> listaTipologie = new List<Tipologia>()
            {
                new Tipologia("364","Verifiche statiche speditive (TRIAGE)","")
            };

            var intervento = new Intervento()
            {
                Tipologie = listaTipologie,
                DettaglioTipologia = command.Chiamata.DettaglioTipologia,
                Descrizione = command.Chiamata.Descrizione,
                Richiedente = command.Chiamata.Richiedente,
                Localita = command.Chiamata.Localita,
                Stato = "Chiamata",
                PrioritaRichiesta = 3,
                Azione = 0
            };

            //command.CodCompetenze = _getCompetenze.GetCompetenzeByCoordinateIntervento(command.Chiamata.Localita.Coordinate);
            var lstCompetenze = command.CodCompetenze.Select(c => _getDistaccamento.Get(c).Result).ToList();
            lstCompetenze.RemoveAll(c => c == null);

            if (command.CodCompetenze.ToList()[0] == null)
                throw new Exception(Costanti.CoordinateErrate);

            intervento.Codice = _generaCodiceRichiesta.GeneraCodiceChiamata(command.CodiceSede, DateTime.UtcNow.Year);
            intervento.CodiceRichiesta = _generaCodiceRichiesta.GeneraCodiceIntervento(command.CodiceSede, DateTime.UtcNow.Year);

            var listaCodiciTipologie = intervento.Tipologie?.Select(t => t.Codice).ToList();
            var utentiInLavorazione = intervento.ListaUtentiInLavorazione?.Select(u => u.Nominativo).ToList();
            var utentiPresaInCarico = intervento.ListaUtentiPresaInCarico?.Select(u => u.Nominativo).ToList();

            command.Chiamata.Localita.SplitIndirizzo();

            var richiesta = new RichiestaAssistenza()
            {
                Tipologie = listaCodiciTipologie,
                //CodZoneEmergenza = intervento.ZoneEmergenza,
                Richiedente = command.Chiamata.Richiedente,
                Localita = command.Chiamata.Localita,
                Descrizione = command.Chiamata.Descrizione,
                Codice = intervento.Codice,
                CodRichiesta = intervento.CodiceRichiesta,
                TrnInsChiamata = _getTurno.Get().Codice,
                TipoTerreno = intervento.TipoTerreno,
                ObiettivoSensibile = intervento.ObiettivoSensibile,
                UtInLavorazione = utentiInLavorazione,
                UtPresaInCarico = utentiPresaInCarico,
                NotePubbliche = intervento.NotePubbliche,
                NotePrivate = intervento.NotePrivate,
                CodUOCompetenza = command.CodCompetenze.ToArray(),
                Competenze = lstCompetenze.Select(d => d.MapSede()).ToList(),
                CodOperatore = command.CodUtente,
                CodSOCompetente = command.CodCompetenze.ToList()[0],
                CodEntiIntervenuti = intervento.listaEnti?.Select(c => c).ToList(),
                DettaglioTipologia = command.Chiamata.DettaglioTipologia,
                TriageSummary = intervento.TriageSummary,
                ChiamataUrgente = intervento.ChiamataUrgente,
                Esercitazione = intervento.Esercitazione
            };

            //Aggiungo le competenze alla chiamata per la gestione delle notifiche di CodaChiamate
            intervento.Competenze = lstCompetenze.Select(d => new Sede(d.Id.ToString(), d.DescDistaccamento, d.Indirizzo, d.Coordinate)).ToList();

            if (intervento.Tags != null)
                richiesta.Tags = new HashSet<string>(intervento.Tags);

            new Telefonata(richiesta, command.Chiamata.Richiedente.Telefono, DateTime.UtcNow, command.CodUtente)
            {
                NominativoChiamante = command.Chiamata.Richiedente.Nominativo,
                Motivazione = intervento.Motivazione,
                NotePrivate = intervento.NotePrivate,
                NotePubbliche = intervento.NotePubbliche,
                NumeroTelefono = command.Chiamata.Richiedente.Telefono,
                Esito = intervento.Azione.ToString(),
                CodiceSchedaContatto = intervento.CodiceSchedaNue
            };

            var prioritaRichiesta = (RichiestaAssistenza.Priorita)intervento.PrioritaRichiesta;
            new AssegnazionePriorita(richiesta, prioritaRichiesta, DateTime.UtcNow, command.CodUtente);

            if (intervento.RilevanteGrave || intervento.RilevanteStArCu)
                new MarcaRilevante(richiesta, DateTime.UtcNow, command.CodUtente, "", intervento.RilevanteGrave,

            intervento.RilevanteStArCu);

            if (intervento.CodiceSchedaNue != null)
            {
                var codiceFiscaleOperatore = _getUtenteById.GetUtenteByCodice(command.CodUtente).CodiceFiscale;
                _setStatoGestioneSchedaContatto.Gestita(intervento.CodiceSchedaNue, command.CodiceSede, codiceFiscaleOperatore, true, intervento.Codice);
            }

            _saveRichiestaAssistenza.Save(richiesta);

            //Salvo l'intervento nel command per usarlo nella notifica
            command.Chiamata.Codice = intervento.Codice;
            command.Chiamata.CodiceRichiesta = intervento.CodiceRichiesta;
            command.Intervento = richiesta;
        }
    }
}
