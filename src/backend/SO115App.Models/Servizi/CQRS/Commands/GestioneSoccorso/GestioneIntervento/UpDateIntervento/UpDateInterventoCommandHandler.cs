﻿//-----------------------------------------------------------------------
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

using CQRS.Commands;
using SO115App.API.Models.Classi.Soccorso.Eventi;
using SO115App.API.Models.Classi.Soccorso.Eventi.Partenze;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Classi.Gac;
using SO115App.Models.Classi.ServiziEsterni.Gac;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DomainModel.CQRS.Commands.UpDateIntervento
{
    public class UpDateInterventoCommandHandler : ICommandHandler<UpDateInterventoCommand>
    {
        private readonly IUpDateRichiestaAssistenza _updateRichiestaAssistenza;
        private readonly IGetRichiesta _getRichiestaById;
        private readonly IModificaInterventoChiuso _modificaInterventoChiuso;

        public UpDateInterventoCommandHandler(
            IUpDateRichiestaAssistenza updateRichiestaAssistenza,
            IGetRichiesta getRichiestaById,
            IModificaInterventoChiuso modificaInterventoChiuso)
        {
            _updateRichiestaAssistenza = updateRichiestaAssistenza;
            _getRichiestaById = getRichiestaById;
            _modificaInterventoChiuso = modificaInterventoChiuso;
        }

        public void Handle(UpDateInterventoCommand command)
        {
            var richiesta = _getRichiestaById.GetByCodice(command.Chiamata.Codice);

            bool modificaInterventoChiuso = false;
            List<ModificaMovimentoGAC> lstModificheMovimentiGAC = null;

            if(richiesta.Chiusa && !string.IsNullOrEmpty(command.Chiamata.CodiceRichiesta) && (command.Chiamata.Tipologie.Select(t => t.Codice) != richiesta.Tipologie || command.Chiamata.Localita != richiesta.Localita))
            {
                lstModificheMovimentiGAC = richiesta.ListaEventi?.OfType<ComposizionePartenze>()?.Select(partenza => new ModificaMovimentoGAC()
                {
                    comune = new ComuneGAC()
                    {
                        codice = "",
                        descrizione = command.Chiamata.Localita.Citta
                    },
                    idPartenza = partenza.CodicePartenza,
                    autista = partenza.Partenza.Squadre.First().Membri.First(m => m.DescrizioneQualifica == "DRIVER").Nominativo,
                    dataIntervento = command.Chiamata.IstanteRicezioneRichiesta,
                    latitudine = command.Chiamata.Localita.Coordinate.Latitudine.ToString(),
                    longitudine = command.Chiamata.Localita.Coordinate.Longitudine.ToString(),
                    localita = command.Chiamata.Localita.Citta,
                    numeroIntervento = command.Chiamata.CodiceRichiesta,
                    provincia = new ProvinciaGAC()
                    {
                        codice = "",
                        descrizione = command.Chiamata.Localita.Provincia
                    },
                    targa = partenza.CodiceMezzo,
                    tipoMezzo = partenza.Partenza.Mezzo.Genere,
                    dataRientro = richiesta.ListaEventi.OfType<AbstractPartenza>().Last(p => p.CodicePartenza == partenza.CodicePartenza).Istante,
                    dataUscita = richiesta.ListaEventi.OfType<AbstractPartenza>().Last(p => p.CodicePartenza == partenza.CodicePartenza).Istante,
                    tipoUscita = new TipoUscita()
                    {
                        codice = "",
                        descrizione = ""
                    }
                }).ToList();

                modificaInterventoChiuso = true;
            }

            var priorita = command.Chiamata.PrioritaRichiesta;

            var listaCodiciTipologie = command.Chiamata.Tipologie.Select(t => t.Codice).ToList();

            var utentiInLavorazione = new List<string>();
            if (command.Chiamata.ListaUtentiInLavorazione != null)
                foreach (var utente in command.Chiamata.ListaUtentiInLavorazione)
                    utentiInLavorazione.Add(utente.Nominativo);

            var utentiPresaInCarico = new List<string>();
            if (command.Chiamata.ListaUtentiPresaInCarico != null)
                foreach (var utente in command.Chiamata.ListaUtentiPresaInCarico)
                    utentiPresaInCarico.Add(utente.Nominativo);

            richiesta.Tipologie = listaCodiciTipologie;
            richiesta.DettaglioTipologia = command.Chiamata.DettaglioTipologia;
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
            richiesta.CodEntiIntervenuti = command.Chiamata.listaEnti != null ? command.Chiamata.listaEnti.Select(c => c).ToList() : null;
            richiesta.TriageSummary = command.Chiamata.TriageSummary;
            richiesta.ChiamataUrgente = command.Chiamata.ChiamataUrgente;
            richiesta.Esercitazione = command.Chiamata.Esercitazione;

            if (command.Chiamata.Tags != null)
                richiesta.Tags = new HashSet<string>(command.Chiamata.Tags);

            richiesta.SincronizzaStatoRichiesta(command.Chiamata.Stato, richiesta.StatoRichiesta, command.CodUtente, command.Chiamata.Motivazione, DateTime.UtcNow, null);

            if (command.Chiamata.RilevanteGrave != richiesta.RilevanteGrave || command.Chiamata.RilevanteStArCu != richiesta.RilevanteStArCu)
                new MarcaRilevante(richiesta, DateTime.UtcNow.AddMilliseconds(1.5), command.CodUtente, "", command.Chiamata.RilevanteGrave, command.Chiamata.RilevanteStArCu);

            var prioritaRichiesta = command.Chiamata.PrioritaRichiesta;

            if (richiesta.PrioritaRichiesta != prioritaRichiesta)
                new AssegnazionePriorita(richiesta, prioritaRichiesta, DateTime.UtcNow, command.CodUtente);

            _updateRichiestaAssistenza.UpDate(richiesta);

            if(modificaInterventoChiuso)
            {
                Parallel.ForEach(lstModificheMovimentiGAC, movimento => _modificaInterventoChiuso.Send(movimento));
            }
        }
    }
}
