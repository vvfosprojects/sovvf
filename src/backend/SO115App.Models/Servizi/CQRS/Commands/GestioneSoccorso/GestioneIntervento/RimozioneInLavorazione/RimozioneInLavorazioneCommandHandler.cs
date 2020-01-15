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
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Classi.Soccorso;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;

namespace DomainModel.CQRS.Commands.RimozioneInLavorazione
{
    public class RimozioneInLavorazioneCommandHandler : ICommandHandler<RimozioneInLavorazioneCommand>
    {
        private readonly IGetRichiestaById _getRichiestaById;
        private readonly IUpDateRichiestaAssistenza _updateRichiestaAssistenza;

        public RimozioneInLavorazioneCommandHandler(
            IGetRichiestaById getRichiestaById,
            IUpDateRichiestaAssistenza updateRichiestaAssistenza
            )
        {
            _getRichiestaById = getRichiestaById;
            _updateRichiestaAssistenza = updateRichiestaAssistenza;
        }

        public void Handle(RimozioneInLavorazioneCommand command)
        {
            var richiesta = _getRichiestaById.Get(command.IdRichiesta);
            var attivita = new AttivitaUtente();

            richiesta.UtInLavorazione.RemoveAll(x => x == command.IdUtente);

            richiesta.Id = richiesta.Codice;

            //if (command.Chiamata.ListaUtentiInLavorazione != null)
            //    command.Chiamata.ListaUtentiInLavorazione = richiesta.UtInLavorazione;
            //else
            //{
            //    if (richiesta.UtInLavorazione.Count > 0)
            //    {
            //        command.Chiamata.ListaUtentiInLavorazione = new List<AttivitaUtente>();
            //        command.Chiamata.ListaUtentiInLavorazione = richiesta.UtInLavorazione;
            //    }
            //}

            _updateRichiestaAssistenza.UpDate(richiesta);
        }
    }
}
