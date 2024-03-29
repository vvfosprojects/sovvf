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
using SO115App.API.Models.Classi.Soccorso.Eventi.Segnalazioni;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Classi.Gac;
using SO115App.Models.Classi.ServiziEsterni.Gac;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.GestioneTipologie;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static SO115App.API.Models.Classi.Soccorso.RichiestaAssistenza;

namespace DomainModel.CQRS.Commands.UpDateIntervento
{
    public class UpDateInterventoCommandHandler : ICommandHandler<UpDateInterventoCommand>
    {
        private readonly IUpDateRichiestaAssistenza _updateRichiestaAssistenza;
        private readonly IGetRichiesta _getRichiestaById;
        private readonly IModificaInterventoChiuso _modificaInterventoChiuso;
        private readonly IGetTipologieByCodice _getTipologie;
        private readonly ISetStatoGestioneSchedaContatto _setStatoGestioneSchedaContatto;
        private readonly IGetUtenteById _getUtenteById;

        public UpDateInterventoCommandHandler(
            IUpDateRichiestaAssistenza updateRichiestaAssistenza,
            IGetRichiesta getRichiestaById,
            IModificaInterventoChiuso modificaInterventoChiuso,
            IGetTipologieByCodice getTipologie,
            ISetStatoGestioneSchedaContatto setStatoGestioneSchedaContatto,
            IGetUtenteById getUtenteById)
        {
            _updateRichiestaAssistenza = updateRichiestaAssistenza;
            _getRichiestaById = getRichiestaById;
            _modificaInterventoChiuso = modificaInterventoChiuso;
            _getTipologie = getTipologie;
            _setStatoGestioneSchedaContatto = setStatoGestioneSchedaContatto;
            _getUtenteById = getUtenteById;
        }

        public void Handle(UpDateInterventoCommand command)
        {
            var richiesta = _getRichiestaById.GetByCodice(command.Chiamata.Codice);

            bool modificaInterventoChiuso = false;
            ModificaMovimentoGAC modificheMovimentiGAC = null;

            if (richiesta.Chiusa && !string.IsNullOrEmpty(command.Chiamata.CodiceRichiesta) && (command.Chiamata.Tipologie.Select(t => t.Codice) != richiesta.Tipologie || command.Chiamata.Localita != richiesta.Localita))
            {
                var tipologia = _getTipologie.Get(new List<string> { command.Chiamata.Tipologie.First().Codice }).First();

                modificheMovimentiGAC = richiesta.ListaEventi?.OfType<ComposizionePartenze>()?.Select(partenza => new ModificaMovimentoGAC()
                {
                    comune = new ComuneGAC()
                    {
                        codice = "",
                        descrizione = command.Chiamata.Localita.Citta
                    },
                    idPartenza = partenza.CodicePartenza,
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
                    targa = partenza.CodiceMezzo.Split('.')[1],
                    tipoMezzo = partenza.Partenza.Mezzo.Codice.Split('.')[0],
                    autistaRientro = partenza.Partenza.Terminata ? partenza.Partenza.Squadre.SelectMany(s => s.Membri).First(m => m.DescrizioneQualifica.Equals("DRIVER")).CodiceFiscale : null,
                    dataRientro = richiesta.ListaEventi.OfType<PartenzaRientrata>().LastOrDefault(p => p.CodicePartenza == partenza.CodicePartenza)?.Istante,
                    autistaUscita = partenza.Partenza.Squadre.First().Membri.First(m => m.DescrizioneQualifica == "DRIVER").CodiceFiscale, //RICONTROLLARE
                    dataUscita = richiesta.ListaEventi.OfType<AbstractPartenza>().Last(p => p.CodicePartenza == partenza.CodicePartenza).Istante,
                    tipoUscita = new TipoUscita()
                    {
                        codice = tipologia.Codice,
                        descrizione = tipologia.Descrizione
                    }
                }).Last();

                modificaInterventoChiuso = true;
            }

            var priorita = command.Chiamata.PrioritaRichiesta;

            var listaCodiciTipologie = command.Chiamata.Tipologie;

            var utentiInLavorazione = new List<string>();
            if (command.Chiamata.ListaUtentiInLavorazione != null)
                foreach (var utente in command.Chiamata.ListaUtentiInLavorazione)
                    utentiInLavorazione.Add(utente.Nominativo);

            var utentiPresaInCarico = new List<string>();
            if (command.Chiamata.ListaUtentiPresaInCarico != null)
                foreach (var utente in command.Chiamata.ListaUtentiPresaInCarico)
                    utentiPresaInCarico.Add(utente.Nominativo);

            richiesta.CodUOCompetenza = command.Chiamata.CodCompetenze != null ? command.Chiamata.CodCompetenze.ToArray() : null;
            richiesta.Competenze = command.Chiamata.Competenze;
            richiesta.Tipologie = listaCodiciTipologie;
            richiesta.DettaglioTipologia = command.Chiamata.DettaglioTipologia;
            richiesta.CodZoneEmergenza = command.Chiamata.ZoneEmergenza != null ? new string[] { command.Chiamata.ZoneEmergenza } : null;
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

            if (richiesta.CodNue == null && command.Chiamata.CodiceSchedaNue?.Length > 0)
            {
                richiesta.NoteNue = command.Chiamata.NoteNue;
                var telefonata = richiesta.ListaEventi.ToList().Find(e => e is Telefonata);
                ((Telefonata)telefonata).CodiceSchedaContatto = command.Chiamata.CodiceSchedaNue;

                var codiceFiscaleOperatore = _getUtenteById.GetUtenteByCodice(command.CodUtente).CodiceFiscale;
                _setStatoGestioneSchedaContatto.Gestita(command.Chiamata.CodiceSchedaNue, command.CodiceSede, codiceFiscaleOperatore, true, command.Chiamata.Codice);
            }

            if (command.Chiamata.Tags != null)
                richiesta.Tags = new HashSet<string>(command.Chiamata.Tags);

            richiesta.SincronizzaStatoRichiesta(command.Chiamata.Stato, richiesta.StatoRichiesta, command.CodUtente, command.Chiamata.Motivazione, DateTime.UtcNow, null);

            if (command.Chiamata.RilevanteGrave != richiesta.RilevanteGrave || command.Chiamata.RilevanteStArCu != richiesta.RilevanteStArCu)
                new MarcaRilevante(richiesta, DateTime.UtcNow.AddMilliseconds(1.5), command.CodUtente, "", command.Chiamata.RilevanteGrave, command.Chiamata.RilevanteStArCu);

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

            new RichiestaModificata(richiesta, DateTime.UtcNow, command.CodUtente);

            if (modificaInterventoChiuso)
            {
                _modificaInterventoChiuso.Send(modificheMovimentiGAC);
            }

            _updateRichiestaAssistenza.UpDate(richiesta);
        }
    }
}
