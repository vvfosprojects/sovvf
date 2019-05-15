//-----------------------------------------------------------------------
// <copyright file="DeselezionaSquadraCommandHandler.cs" company="CNVVF">
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
using SO115App.API.Models.Servizi.CQRS.Commands.GestioneSoccorso.DeselezionaSquadra.CommandDTO;
using SO115App.API.Models.Servizi.Infrastruttura.Autenticazione;

namespace SO115App.API.Models.Servizi.CQRS.Commands.GestioneSoccorso.DeselezionaSquadra
{
    /// <summary>
    ///   Deseleziona una squadra selezionata se la selezione appartiene all'operatore corrente. La
    ///   deselezione rende nuovamante disponibile la risorsa squadra dall'uso da parte di tutte le
    ///   altre postazioni concorrenti.
    /// </summary>
    public class DeselezionaSquadraCommandHandler : ICommandHandler<DeselezionaSquadraCommand>
    {
        /// <summary>
        ///   Dipendenza che restituisce l'operatore correntemente autenticato.
        /// </summary>
        private readonly IGetOperatoreAutenticato getOperatoreAutenticato;

        /// <summary>
        ///   Servizio che imposta la deselezione di una DisponibilitaSquadra per la risoluzione
        ///   delle contese.
        /// </summary>
        private readonly ITestAndSetDeselezioneDisponibilitaSquadra testAndSetDeselezioneDisponibilitaSquadra;

        /// <summary>
        ///   Costruttore del servizio
        /// </summary>
        /// <param name="getOperatoreAutenticato">Istanza del servizio <see cref="IGetOperatoreAutenticato" />.</param>
        /// <param name="testAndSetDeselezioneDisponibilitaSquadra">Istanza del servizio <see cref="ITestAndSetDeselezioneDisponibilitaSquadra" />.</param>
        public DeselezionaSquadraCommandHandler(
            IGetOperatoreAutenticato getOperatoreAutenticato,
            ITestAndSetDeselezioneDisponibilitaSquadra testAndSetDeselezioneDisponibilitaSquadra)
        {
            this.getOperatoreAutenticato = getOperatoreAutenticato;
            this.testAndSetDeselezioneDisponibilitaSquadra = testAndSetDeselezioneDisponibilitaSquadra;
        }

        /// <summary>
        ///   Deseleziona la squadra.
        /// </summary>
        /// <param name="command">Command relativo alla squadra selezionata.</param>
        /// <remarks>Nel caso che la deselezione non vada a buon fine, il Command solleva un'eccezione</remarks>
        public void Handle(DeselezionaSquadraCommand command)
        {
            var operatore = this.getOperatoreAutenticato.Get();

            // Test And Set DeselezioneRisorsa su DisponibilitaSquadra
            this.testAndSetDeselezioneDisponibilitaSquadra.Esegui(operatore, command.Ticket);
        }
    }
}