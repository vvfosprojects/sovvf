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
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Classi.Soccorso.Eventi;
using SO115App.API.Models.Classi.Soccorso.Eventi.Segnalazioni;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.GenerazioneCodiciRichiesta;
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

        public AddInterventoCommandHandler(ISaveRichiestaAssistenza saveRichiestaAssistenza, IGeneraCodiceRichiesta generaCodiceRichiesta, IGetTurno getTurno)
        {
            this._saveRichiestaAssistenza = saveRichiestaAssistenza;
            _generaCodiceRichiesta = generaCodiceRichiesta;
            _getTurno = getTurno;
        }

        public void Handle(AddInterventoCommand command)
        {
            var sedeRichiesta = command.CodiceSede;
            var prioritaRichiesta = (RichiestaAssistenza.Priorita)command.Chiamata.PrioritaRichiesta;
            var codiceChiamata = _generaCodiceRichiesta.GeneraCodiceChiamata(sedeRichiesta, DateTime.UtcNow.Year);
            command.Chiamata.Codice = codiceChiamata;
            command.Chiamata.Id = codiceChiamata;
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

            //DA TOGLIERE COM MONGO
            var listaTipologiaFake = new List<Tipologia>() {
                    new Tipologia("5","Incendio normale (generico)","")
                    {
                        Codice = "5",
                        Descrizione= "Incendio normale (generico)",
                        Categoria = "Incendi ed Esplosioni",
                        Star = true,
                        OpportunitaSganciamento = 50,
                        AdeguatezzaMezzo = new MatriceAdeguatezzaMezzo()
                        {
                            APS = "100",
                            AS = "80",
                            AB = "50",
                            AV = "10",
                            AG = "0",
                            DEFAULT = "10"
                        }
                    }
                };

            string[] CodUOCompetenzaAppo = { "RM.1000" };

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
                //Id = codiceChiamata // TODO DA TOGLIERE QUANDO AVREMO UN DB
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
