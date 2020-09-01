//-----------------------------------------------------------------------
// <copyright file="UpDateRichiesta.cs" company="CNVVF">
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

using DomainModel.CQRS.Commands.ConfermaPartenze;
using SO115App.API.Models.Classi.Composizione;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.Mezzi;
using SO115App.Models.Servizi.Infrastruttura.GestioneStatoOperativoSquadra;
using System;

namespace SO115App.ExternalAPI.Fake.Composizione
{
    /// <summary>
    ///   La classe aggiorna i dati relativi alle squadre, ai mezzi e alla partenza di una richiesta
    ///   in seguito ad un command
    /// </summary>
    public class UpdateConfermaPartenzeExt : IUpdateConfermaPartenze
    {
        private readonly IUpDateRichiestaAssistenza _updateRichiesta;
        private readonly ISetStatoOperativoMezzo _setStatoOperativoMezzo;
        private readonly ISetStatoSquadra _setStatoSquadra;

        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        public UpdateConfermaPartenzeExt(IUpDateRichiestaAssistenza updateRichiesta, ISetStatoOperativoMezzo setStatoOperativoMezzo, ISetStatoSquadra setStatoSquadra)
        {
            _updateRichiesta = updateRichiesta;
            _setStatoOperativoMezzo = setStatoOperativoMezzo;
            _setStatoSquadra = setStatoSquadra;
        }

        /// <summary>
        ///   Il metodo accetta in firma il command, e aggiorna i dati relativi alla conferma della partenza
        /// </summary>
        /// <param name="command">il command in ingresso</param>
        /// <returns>ConfermaPartenze</returns>
        public ConfermaPartenze Update(ConfermaPartenzeCommand command)
        {
            var conferma = new ConfermaPartenze();

            _updateRichiesta.UpDate(command.ConfermaPartenze.richiesta);
            foreach (var partenza in command.ConfermaPartenze.Partenze)
            {
                var dataMovintazione = DateTime.UtcNow;

                _setStatoOperativoMezzo.Set(partenza.Mezzo.Distaccamento.Codice, partenza.Mezzo.Codice, partenza.Mezzo.Stato, command.ConfermaPartenze.IdRichiesta);

                foreach (var squadra in partenza.Squadre)
                {
                    _setStatoSquadra.SetStato(squadra.Codice, command.ConfermaPartenze.IdRichiesta, squadra.Stato.ToString(), squadra.Distaccamento.Codice);
                }
            }

            conferma.CodiceSede = command.ConfermaPartenze.CodiceSede;
            conferma.IdRichiesta = command.ConfermaPartenze.IdRichiesta;
            conferma.richiesta = command.ConfermaPartenze.richiesta;
            return conferma;
        }
    }
}
