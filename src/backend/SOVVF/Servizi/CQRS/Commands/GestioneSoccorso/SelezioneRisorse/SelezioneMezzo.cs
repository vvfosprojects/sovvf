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
using Modello.Servizi.Infrastruttura.Autenticazione;

namespace Modello.Servizi.CQRS.Commands.GestioneSoccorso.SelezioneRisorse
{
    /// <summary>
    ///   Scatena la selezione di un Mezzo per l'assegnazione ad una
    ///   <see cref="ComposizionePartenza" />. La selezione sottrae la risorsa Mezzo dall'uso da
    ///   parte di tutte le altre postazioni concorrenti.
    /// </summary>
    public class SelezioneMezzo
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
        /// <param name="getOperatoreAutenticato">Istanza del servizio <see cref="IGetOperatoreAutenticato" />.</param>
        /// <param name="testAndSetSelezioneDisponibilitaMezzo">Istanza del servizio <see cref="ITestAndSetSelezioneDisponibilitaMezzo" />.</param>
        public SelezioneMezzo(
            IGetOperatoreAutenticato getOperatoreAutenticato,
            ITestAndSetSelezioneDisponibilitaMezzo testAndSetSelezioneDisponibilitaMezzo)
        {
            this.getOperatoreAutenticato = getOperatoreAutenticato;
            this.testAndSetSelezioneDisponibilitaMezzo = testAndSetSelezioneDisponibilitaMezzo;
        }

        /// <summary>
        ///   Seleziona un Mezzo.
        /// </summary>
        /// <returns>La <see cref="SelezioneRisorsa" /> corrente.</returns>
        /// <param name="codiceMezzo">Codice del Mezzo selezionato</param>
        /// <remarks>
        ///   Per controllare che la selezione sia andata a buon fine, sul client verrà controllato
        ///   che l'operatore della SelezioneRisorsa sia se stesso
        /// </remarks>
        public SelezioneRisorsa Seleziona(string codiceMezzo)
        {
            var operatore = this.getOperatoreAutenticato.Get();

            // Test And Set SelezioneRisorsa su DisponibilitaSquadra ritorna il valore corrente di SelezioneRisorsa
            var selezioneRisorsa = this.testAndSetSelezioneDisponibilitaMezzo.Esegui(operatore, codiceMezzo);

            // notifica selezione avvenuta. Anzi, no: la notifica avviene con servizi ortogonali
            return selezioneRisorsa;
        }
    }
}
