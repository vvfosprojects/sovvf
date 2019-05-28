//-----------------------------------------------------------------------
// <copyright file="SelezionaSquadraCommandHandler.cs" company="CNVVF">
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
using SO115App.API.Models.Servizi.CQRS.Commands.GestioneSoccorso.SelezioneSquadra.CommandDTO;
using SO115App.API.Models.Servizi.Infrastruttura.Autenticazione;
using System;

namespace SO115App.API.Models.Servizi.CQRS.Commands.GestioneSoccorso.SelezioneSquadra
{
    /// <summary>
    ///   Scatena la selezione di una squadra per l'assegnazione ad una
    ///   <see cref="ComposizionePartenza" />. La selezione sottrae la risorsa squadra dall'uso da
    ///   parte di tutte le altre postazioni concorrenti.
    /// </summary>
    public class SelezionaSquadraCommandHandler : ICommandHandler<SelezionaSquadraCommand>
    {
        /// <summary>
        ///   Dipendenza che restituisce l'operatore correntemente autenticato.
        /// </summary>
        private readonly IGetOperatoreAutenticato getOperatoreAutenticato;

        /// <summary>
        ///   Servizio che imposta la selezione di una DisponibilitaSquadra per la risoluzione delle contese.
        /// </summary>
        private readonly ITestAndSetSelezioneDisponibilitaSquadra testAndSetSelezioneDisponibilitaSquadra;

        /// <summary>
        ///   Costruttore del servizio
        /// </summary>
        /// <param name="getOperatoreAutenticato">Istanza del servizio <see cref="IGetOperatoreAutenticato" />.</param>
        /// <param name="testAndSetSelezioneDisponibilitaSquadra">Istanza del servizio <see cref="ITestAndSetSelezioneDisponibilitaSquadra" />.</param>
        public SelezionaSquadraCommandHandler(
            IGetOperatoreAutenticato getOperatoreAutenticato,
            ITestAndSetSelezioneDisponibilitaSquadra testAndSetSelezioneDisponibilitaSquadra)
        {
            this.getOperatoreAutenticato = getOperatoreAutenticato;
            this.testAndSetSelezioneDisponibilitaSquadra = testAndSetSelezioneDisponibilitaSquadra;
        }

        /// <summary>
        ///   Seleziona la squadra.
        /// </summary>
        /// <param name="command">Command relativo alla squadra selezionata.</param>
        /// <remarks>Nel caso che la selezione non vada a buon fine, il Command solleva un'eccezione</remarks>
        public void Handle(SelezionaSquadraCommand command)
        {
            var operatore = this.getOperatoreAutenticato.Get();

            // Test And Set SelezioneRisorsa su DisponibilitaSquadra ritorna il valore corrente di SelezioneRisorsa
            var selezioneRisorsa = this.testAndSetSelezioneDisponibilitaSquadra.Esegui(operatore, command.Ticket);

            if (selezioneRisorsa.Operatore != operatore)
            {
#warning Aggiungere una nuova eccezione dedicata

                throw new InvalidOperationException("Risorsa già selezionata da " + selezioneRisorsa.Operatore);
            }

            // notifica selezione avvenuta. Anzi, no: la notifica avviene con servizi ortogonali
        }
    }
}