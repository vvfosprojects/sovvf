//-----------------------------------------------------------------------
// <copyright file="SelezionaMezzoCommandHandler.cs" company="CNVVF">
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
using System;
using CQRS.Commands;
using SO115App.API.Models.Classi.Soccorso.Risorse;
using SO115App.API.Models.Servizi.CQRS.Commands.GestioneSoccorso.SelezioneMezzo.CommandDTO;
using SO115App.API.Models.Servizi.Infrastruttura.Autenticazione;

namespace SO115App.API.Models.Servizi.CQRS.Commands.GestioneSoccorso.SelezioneMezzo
{
    /// <summary>
    ///   Scatena la selezione di un mezzo per l'assegnazione ad una
    ///   <see cref="ComposizionePartenza" />. La selezione sottrae la risorsa mezzo dall'uso da
    ///   parte di tutte le altre postazioni concorrenti.
    /// </summary>
    public class SelezionaMezzoCommandHandler : ICommandHandler<SelezionaMezzoCommand>
    {
        /// <summary>
        ///   Dipendenza che restituisce l'operatore correntemente autenticato.
        /// </summary>
        private readonly IGetOperatoreAutenticato getOperatoreAutenticato;

        /// <summary>
        ///   Servizio che imposta la selezione di una DisponibilitaMezzo per la risoluzione delle contese.
        /// </summary>
        private readonly ITestAndSetSelezioneDisponibilitaMezzo testAndSetSelezioneDisponibilitaMezzo;

        /// <summary>
        ///   Costruttore del servizio
        /// </summary>
        /// <param name="getOperatoreAutenticato">Servizio recupero operatore autenticato.</param>
        /// <param name="testAndSetSelezioneDisponibilitaMezzo">
        ///   Servizio per la selezione del mezzo
        /// </param>
        public SelezionaMezzoCommandHandler(
            IGetOperatoreAutenticato getOperatoreAutenticato,
            ITestAndSetSelezioneDisponibilitaMezzo testAndSetSelezioneDisponibilitaMezzo)
        {
            this.getOperatoreAutenticato = getOperatoreAutenticato;
            this.testAndSetSelezioneDisponibilitaMezzo = testAndSetSelezioneDisponibilitaMezzo;
        }

        /// <summary>
        ///   Seleziona il mezzo.
        /// </summary>
        /// <param name="command">Command relativo al mezzo selezionato.</param>
        /// <remarks>Nel caso che la selezione non vada a buon fine, il Command solleva un'eccezione</remarks>
        public void Handle(SelezionaMezzoCommand command)
        {
            var operatore = this.getOperatoreAutenticato.Get();

            var selezioneRisorsa = this.testAndSetSelezioneDisponibilitaMezzo.Esegui(operatore, command.CodiceMezzo);

            if (operatore != selezioneRisorsa.Operatore)
            {
                throw new InvalidOperationException("Risorsa già selezionata da " + selezioneRisorsa.Operatore);
            }
        }
    }
}
