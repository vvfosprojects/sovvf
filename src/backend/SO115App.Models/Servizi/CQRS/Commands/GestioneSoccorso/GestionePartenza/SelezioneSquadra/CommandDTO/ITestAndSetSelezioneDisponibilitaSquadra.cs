//-----------------------------------------------------------------------
// <copyright file="ITestAndSetSelezioneDisponibilitaSquadra.cs" company="CNVVF">
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
using SO115App.API.Models.Classi.Soccorso.Risorse;

namespace SO115App.API.Models.Servizi.CQRS.Commands.GestioneSoccorso.SelezioneSquadra.CommandDTO
{
    /// <summary>
    ///   Servizio di selezione sulla <see cref="DisponibilitaSquadra" />. L'operazione effettuata da
    ///   questo servizio è atomica (test and set). Il servizio effettua l'operazione solo se la
    ///   squadra non risulta già selezionata (risoluzione della contesa).
    /// </summary>
    /// <remarks>
    ///   Quando una <see cref="DisponibilitaSquadra" /> viene selezionata diventa non disponibile
    ///   per la selezione da parte di altri operatori.
    /// </remarks>
    public interface ITestAndSetSelezioneDisponibilitaSquadra
    {
        /// <summary>
        ///   Seleziona una <see cref="DisponibilitaSquadra" /> non già selezionata, con semantica atomica.
        /// </summary>
        /// <returns>La selezione che risulta impostata.</returns>
        /// <param name="operatore">Operatore che richiede la selezione.</param>
        /// <param name="ticket">Ticket della squadra selezionata.</param>
        /// <returns>
        ///   In caso di successo del test and set, la <see cref="SelezioneRisorsa" /> restituita è
        ///   quella relativa alla prenotazione risorsa appena fatta. In caso di fallimento (risorsa
        ///   già selezionata) viene restituita la selezione corrente.
        /// </returns>
        SelezioneRisorsa Esegui(string operatore, string ticket);
    }
}
