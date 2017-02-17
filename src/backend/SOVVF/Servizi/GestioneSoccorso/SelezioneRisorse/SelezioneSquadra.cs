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

using Modello.Classi.Soccorso.Risorse;
using Modello.Classi.Soccorso.Squadre;
using Modello.Servizi.Infrastruttura.Autenticazione;

namespace Modello.Servizi.GestioneSoccorso.SelezioneRisorse
{
    /// <summary>
    ///   Scatena la selezione di una squadra per l'assegnazione ad una
    ///   <see cref="ComposizionePartenza" />. La selezione sottrae la risorsa squadra dall'uso da
    ///   parte di tutte le altre postazioni concorrenti.
    /// </summary>
    public class SelezioneSquadra
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
        public SelezioneSquadra(
            IGetOperatoreAutenticato getOperatoreAutenticato,
            ITestAndSetSelezioneDisponibilitaSquadra testAndSetSelezioneDisponibilitaSquadra)
        {
            this.getOperatoreAutenticato = getOperatoreAutenticato;
            this.testAndSetSelezioneDisponibilitaSquadra = testAndSetSelezioneDisponibilitaSquadra;
        }

        /// <summary>
        ///   Seleziona la squadra.
        /// </summary>
        /// <param name="ticket">Ticket della squadra selezionata.</param>
        /// <returns>La <see cref="SelezioneRisorsa" /> corrente.</returns>
        /// <remarks>
        ///   Per controllare che la selezione sia andata a buon fine, sul client verrà controllato
        ///   che l'operatore della SelezioneRisorsa sia se stesso
        /// </remarks>
        public SelezioneRisorsa Seleziona(string ticket)
        {
            var operatore = this.getOperatoreAutenticato.Get();

            // Test And Set SelezioneRisorsa su DisponibilitaSquadra ritorna il valore corrente di SelezioneRisorsa
            var selezioneRisorsa = this.testAndSetSelezioneDisponibilitaSquadra.Esegui(operatore, ticket);

            // notifica selezione avvenuta. Anzi, no: la notifica avviene con servizi ortogonali
            return selezioneRisorsa;
        }
    }
}
