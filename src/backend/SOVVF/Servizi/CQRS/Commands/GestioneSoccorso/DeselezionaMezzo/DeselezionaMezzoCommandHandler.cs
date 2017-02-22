// Copyright (C) 2017 - CNVVF
//
// This file is part of SOVVF. SOVVF is free software: you can redistribute it and/or modify it under
// the terms of the GNU Affero General Public License as published by the Free Software Foundation,
// either version 3 of the License, or (at your option) any later version.
//
// SOVVF is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even
// the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero
// General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License along with this program.
// If not, see <http://www.gnu.org/licenses/>.
using Modello.Servizi.Infrastruttura.Autenticazione;
using Modello.Servizi.CQRS.Commands.GestioneSoccorso.DeselezionaMezzo.CommandDTO;

namespace Modello.Servizi.CQRS.Commands.GestioneSoccorso.DeselezionaMezzo
{
    /// <summary>
    ///   Deseleziona un mezzo selezionato se la selezione appartiene all'operatore corrente. La
    ///   deselezione rende nuovamante disponibile la risorsa mezzo dall'uso da parte di tutte le
    ///   altre postazioni concorrenti.
    /// </summary>
    public class DeselezionaMezzoCommandHandler : ICommandHandler<DeselezionaMezzoCommand>
    {
        /// <summary>
        ///   Dipendenza che restituisce l'operatore correntemente autenticato.
        /// </summary>
        private readonly IGetOperatoreAutenticato getOperatoreAutenticato;

        /// <summary>
        ///   Servizio che imposta la deselezione di una DisponibilitaMezzo per la risoluzione
        ///   delle contese.
        /// </summary>
        private readonly ITestAndSetDeselezioneDisponibilitaMezzo testAndSetDeselezioneDisponibilitaMezzo;

        /// <summary>
        ///   Costruttore del servizio
        /// </summary>
        /// <param name="getOperatoreAutenticato">Istanza del servizio <see cref="IGetOperatoreAutenticato" />.</param>
        /// <param name="testAndSetDeselezioneDisponibilitaMezzo">Istanza del servizio <see cref="ITestAndSetDeselezioneDisponibilitaMezzo" />.</param>
        public DeselezionaMezzoCommandHandler(
            IGetOperatoreAutenticato getOperatoreAutenticato,
            ITestAndSetDeselezioneDisponibilitaMezzo testAndSetDeselezioneDisponibilitaMezzo)
        {
            this.getOperatoreAutenticato = getOperatoreAutenticato;
            this.testAndSetDeselezioneDisponibilitaMezzo = testAndSetDeselezioneDisponibilitaMezzo;
        }

        /// <summary>
        ///   Deseleziona la squadra.
        /// </summary>
        /// <param name="command">Command relativo al mezzo selezionato.</param>
        /// <remarks>Nel caso che la deselezione non vada a buon fine, il Command solleva un'eccezione</remarks>
        public void Handle(DeselezionaMezzoCommand command)
        {
            var operatore = this.getOperatoreAutenticato.Get();

            // Test And Set DeselezioneRisorsa su DisponibilitaMezzo
            this.testAndSetDeselezioneDisponibilitaMezzo.Esegui(operatore, command.CodiceMezzo);
        }
    }
}
