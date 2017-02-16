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

namespace Modello.Servizi.GestioneSoccorso
{
    /// <summary>
    ///   Deseleziona un Mezzo selezionato se la selezione appartiene all'operatore corrente. La
    ///   deselezione rende nuovamante disponibile la risorsa Mezzo dall'uso da parte di tutte le
    ///   altre postazioni concorrenti.
    /// </summary>
    public class DeselezioneMezzo
    {
        /// <summary>
        ///   Dipendenza che restituisce l'operatore correntemente autenticato.
        /// </summary>
        private readonly IGetOperatoreAutenticato getOperatoreAutenticato;

        /// <summary>
        ///   Servizio che imposta la deselezione di una DisponibilitaMezzo per la risoluzione delle contese.
        /// </summary>
        private readonly ITestAndSetDeselezioneDisponibilitaMezzo testAndSetDeselezioneDisponibilitaMezzo;

        /// <summary>
        ///   Costruttore del servizio
        /// </summary>
        /// <param name="getOperatoreAutenticato">
        ///   Servizio che restituisce l'operatore correntemente autenticato.
        /// </param>
        /// <param name="testAndSetDeselezioneDisponibilitaMezzo">Istanza del servizio <see cref="ITestAndSetDeselezioneDisponibilitaMezzo" />.</param>
        public DeselezioneMezzo(
            IGetOperatoreAutenticato getOperatoreAutenticato,
            ITestAndSetDeselezioneDisponibilitaMezzo testAndSetDeselezioneDisponibilitaMezzo)
        {
            this.getOperatoreAutenticato = getOperatoreAutenticato;
            this.testAndSetDeselezioneDisponibilitaMezzo = testAndSetDeselezioneDisponibilitaMezzo;
        }

        /// <summary>
        ///   Deseleziona il Mezzo.
        /// </summary>
        /// <param name="codiceMezzo">Codice del Mezzo su cui rimuovere la selezione.</param>
        /// <remarks>
        ///   In caso di fallimento (risorsa selezionata da un altro operatore) verrà sollevata un'eccezione.
        /// </remarks>
        public void Deseleziona(string codiceMezzo)
        {
            var operatore = this.getOperatoreAutenticato.Get();

            this.testAndSetDeselezioneDisponibilitaMezzo.Esegui(operatore, codiceMezzo);

            // notifica Deselezione avvenuta. Anzi, no: la notifica avviene con servizi ortogonali
        }
    }
}
