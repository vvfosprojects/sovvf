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
    ///   Deseleziona una squadra selezionata se la selezione appartiene all'operatore corrente. La
    ///   deselezione rende nuovamante disponibile la risorsa squadra dall'uso da parte di tutte le
    ///   altre postazioni concorrenti.
    /// </summary>
    public class DeselezioneSquadra
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
        /// <param name="getOperatoreAutenticato">
        ///   Servizio che restituisce l'operatore correntemente autenticato.
        /// </param>
        /// <param name="testAndSetDeselezioneDisponibilitaSquadra">Istanza del servizio <see cref="ITestAndSetSelezioneDisponibilitaSquadra" />.</param>
        public DeselezioneSquadra(
            IGetOperatoreAutenticato getOperatoreAutenticato,
            ITestAndSetDeselezioneDisponibilitaSquadra testAndSetDeselezioneDisponibilitaSquadra)
        {
            this.getOperatoreAutenticato = getOperatoreAutenticato;
            this.testAndSetDeselezioneDisponibilitaSquadra = testAndSetDeselezioneDisponibilitaSquadra;
        }

        /// <summary>
        ///   Deseleziona la squadra.
        /// </summary>
        /// <param name="ticket">Ticket della squadra su cui rimuovere la selezione.</param>
        /// <remarks>
        ///   In caso di fallimento (risorsa selezionata da un altro operatore) verrà sollevata un'eccezione.
        /// </remarks>
        public void Deseleziona(string ticket)
        {
            var operatore = this.getOperatoreAutenticato.Get();

            this.testAndSetDeselezioneDisponibilitaSquadra.Esegui(operatore, ticket);

            // notifica Deselezione avvenuta. Anzi, no: la notifica avviene con servizi ortogonali
        }
    }
}
