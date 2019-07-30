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
using CQRS.Commands;
using SO115App.API.Models.Classi.Soccorso;
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

            richiesta.Tipologie = command.Chiamata.Tipologie;
            richiesta.ZoneEmergenza = command.Chiamata.ZoneEmergenza;
            richiesta.Operatore = command.Chiamata.Operatore;
            richiesta.Richiedente = command.Chiamata.Richiedente;
            richiesta.Localita = command.Chiamata.Localita;
            richiesta.Descrizione = command.Chiamata.Descrizione;
            richiesta.TurnoInserimentoChiamata = command.Chiamata.TurnoInserimentoChiamata;
            richiesta.TipoTerreno = command.Chiamata.TipoTerreno;
            richiesta.ListaEntiIntervenuti = command.Chiamata.ListaEntiIntervenuti;
            richiesta.ObiettivoSensibile = command.Chiamata.ObiettivoSensibile;
            richiesta.ListaUtentiInLavorazione = command.Chiamata.ListaUtentiInLavorazione;
            richiesta.ListaUtentiPresaInCarico = command.Chiamata.ListaUtentiPresaInCarico;
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

            richiesta.SincronizzaRilevanza(command.Chiamata.RilevanzaGrave, command.Chiamata.RilevanzaStArCu, command.Chiamata.Operatore.Id, command.Chiamata.Descrizione, command.Chiamata.IstanteRicezioneRichiesta);

            richiesta.SincronizzaStatoRichiesta(command.Chiamata.Stato, richiesta.StatoRichiesta, command.Chiamata.Operatore.Id, command.Chiamata.Motivazione);

            _updateRichiestaAssistenza.UpDate(richiesta);
        }
    }
}
