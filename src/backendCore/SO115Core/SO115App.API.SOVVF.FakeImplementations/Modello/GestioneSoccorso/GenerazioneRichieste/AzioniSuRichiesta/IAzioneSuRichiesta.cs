//-----------------------------------------------------------------------
// <copyright file="IAzioneSuRichiesta.cs" company="CNVVF">
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
using System.Collections.Generic;

namespace SO115App.API.SOVVF.FakeImplementations.Modello.GestioneSoccorso.GenerazioneRichieste.AzioniSuRichiesta
{
    /// <summary>
    ///   Interfaccia dell'azione di aggiunta evento che può essere eseguita su una richiesta
    /// </summary>
    internal interface IAzioneSuRichiesta
    {
        /// <summary>
        ///   L'istante in cui è previsto che l'azione sia aggiunta. L'istante effettivo può essere
        ///   successivo all'istante previsto nel caso in cui non vi sia disponibilità di una risorsa
        ///   all'istante previsto e bisogna attendere che si liberi.
        /// </summary>
        DateTime IstantePrevisto { get; }

        /// <summary>
        ///   Metodo di esecuzione dell'azione
        /// </summary>
        /// <param name="istanteEffettivo">
        ///   L'istante effettivo in cui l'azione viene eseguita. L'istante effettivo può essere
        ///   successivo all'istante previsto nel caso in cui non vi sia disponibilità di una risorsa
        ///   all'istante previsto e bisogna attendere che si liberi.
        /// </param>
        /// <returns>Le azioni da eseguire a seguito dell'esecuzione della presente azione</returns>
        IEnumerable<IAzioneSuRichiesta> Esegui(DateTime istanteEffettivo);

        /// <summary>
        ///   Predicato che indica se l'azione è stata eseguita.
        /// </summary>
        /// <returns>L'indicazione richiesta</returns>
        bool Eseguita();
    }
}
