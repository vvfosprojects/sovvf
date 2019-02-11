//-----------------------------------------------------------------------
// <copyright file="ITestAndSetDeselezioneDisponibilitaMezzo.cs" company="CNVVF">
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
namespace SO115App.API.Models.Servizi.CQRS.Commands.GestioneSoccorso.DeselezionaMezzo.CommandDTO
{
    /// <summary>
    ///   Servizio di deselezione sulla <see cref="DisponibilitaMezzo" />. L'operazione effettuata da
    ///   questo servizio è atomica (test and set). Il servizio effettua l'operazione solo se il
    ///   mezzo risulta selezionata dallo stesso operatore che richiede la deselezione.
    /// </summary>
    /// <remarks>
    ///   Quando una <see cref="DisponibilitaMezzo" /> viene deselezionata ritorna disponibile per la
    ///   selezione da parte di altri operatori.
    /// </remarks>
    public interface ITestAndSetDeselezioneDisponibilitaMezzo
    {
        /// <summary>
        ///   Deseleziona una <see cref="DisponibilitaMezzo" /> selezionata dall'operatore corrente,
        ///   con semantica atomica.
        /// </summary>
        /// <param name="operatore">Operatore che richiede la deselezione.</param>
        /// <param name="codiceMezzo">Identificativo del mezzo selezionato.</param>
        /// <remarks>
        ///   In caso di fallimento (risorsa selezionata da un altro operatore) verrà sollevata un'eccezione.
        /// </remarks>
        void Esegui(string operatore, string codiceMezzo);
    }
}
