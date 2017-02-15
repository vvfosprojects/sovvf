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

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Modello.Classi.Soccorso.Eventi.Partenze;
using Modello.Classi.Soccorso.Risorse;
using Modello.Servizi.Infrastruttura.Autenticazione;

namespace Modello.Servizi.GestioneSoccorso
{
    /// <summary>
    ///   Scatena la selezione di una squadra per l'assegnazione ad una
    ///   <see cref="ComposizionePartenza" />. La selezione sottrae la risorsa squadra dall'uso da
    ///   parte di tutte le altre postazioni concorrenti.
    /// </summary>
    public class SelezioneSquadra
    {
        private readonly IGetDisponibilitaSquadraByTicket getDisponibilitaSquadraByTicket;
        private readonly IGetOperatoreAutenticato getOperatoreAutenticato;
        private readonly ITestAndSetSelezioneDisponibilitaSquadra testAndSetSelezioneDisponibilitaSquadra;

        public SelezioneSquadra(
            IGetDisponibilitaSquadraByTicket getDisponibilitaSquadraByTicket,
            IGetOperatoreAutenticato getOperatoreAutenticato,
            ITestAndSetSelezioneDisponibilitaSquadra testAndSetSelezioneDisponibilitaSquadra)
        {
            this.getDisponibilitaSquadraByTicket = getDisponibilitaSquadraByTicket;
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
            //carica la squadra disponibile da DisponibilitaSquadra
            var disponibilitaSquadra = getDisponibilitaSquadraByTicket.Get(ticket);

            //set SelezioneRisorsa della squadra selezionata
            disponibilitaSquadra.Seleziona(this.getOperatoreAutenticato.Get());

            //Test And Set SelezioneRisorsa su DisponibilitaSquadra
            //ritorna il valore corrente di SelezioneRisorsa
            var selezioneRisorsa = testAndSetSelezioneDisponibilitaSquadra.Esegui(disponibilitaSquadra);
            //notifica selezione avvenuta

            return selezioneRisorsa;
        }
    }
}
