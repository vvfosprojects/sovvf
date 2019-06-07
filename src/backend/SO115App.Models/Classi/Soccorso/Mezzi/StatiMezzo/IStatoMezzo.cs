//-----------------------------------------------------------------------
// <copyright file="IStatoMezzo.cs" company="CNVVF">
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
using SO115App.API.Models.Classi.Soccorso.Eventi.Partenze;

namespace SO115App.API.Models.Classi.Soccorso.Mezzi.StatiMezzo
{
    /// <summary>
    ///   Stati in cui un mezzo partecipante ad una richiesta può trovarsi
    /// </summary>
    public interface IStatoMezzo
    {
        /// <summary>
        ///   Codice identificativo dello stato
        /// </summary>
        string Codice { get; }

        /// <summary>
        ///   Descrizione dello stato
        /// </summary>
        string Descrizione { get; }

        /// <summary>
        ///   Indica se il mezzo è disponibile in questo stato
        /// </summary>
        /// <remarks>
        ///   Un mezzo disponibile può essere utilizzato per una composizione partenza, e ci si
        ///   attende una partenza immediata verso il luogo del sinistro in seguito all'assegnazione.
        /// </remarks>
        bool Disponibile { get; }

#warning rinominare il metodo "DisponibilePerComposizione"

        /// <summary>
        ///   Indica se in questo stato il mezzo risulta assegnato alla richiesta o meno
        /// </summary>
        bool AssegnatoARichiesta { get; }

        /// <summary>
        ///   Indica l'istante in cui la transizione in questo stato è avvenuta
        /// </summary>
        DateTime IstanteTransizione { get; }

        /// <summary>
        ///   Induce una transizione di stato in seguito al verificarsi di un evento, restituendo il
        ///   nuovo stato a seguito della transizione
        /// </summary>
        /// <param name="evento">L'evento che induce la transizione di stato</param>
        /// <returns>Il nuovo stato raggiunto a seguito della transizione</returns>
        IStatoMezzo Transisci(IPartenza evento);
    }
}
