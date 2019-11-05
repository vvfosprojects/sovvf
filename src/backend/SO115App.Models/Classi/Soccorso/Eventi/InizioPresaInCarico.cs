//-----------------------------------------------------------------------
// <copyright file="InizioPresaInCarico.cs" company="CNVVF">
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

namespace SO115App.API.Models.Classi.Soccorso.Eventi
{
    /// <summary>
    ///   Questo evento indica che la richiesta di assistenza alla quale appartiene è presa in
    ///   gestione da un operatore. Risolve la concorrenza nell'accesso alla
    ///   <see cref="RichiestaAssistenza" /> da parte di più operatori.
    /// </summary>
    /// <remarks>
    ///   Un solo operatore può gestire la Richiesta, gli altri potranno solo consultarla in lettura.
    /// </remarks>
    public class InizioPresaInCarico : Evento
    {
        /// <summary>
        ///   Costruttore della classe.
        /// </summary>
        /// <param name="richiesta">E' la richiesta di assistenza a cui si aggiunge l'evento</param>
        /// <param name="istante">E' l'istante in cui si verifica l'evento</param>
        /// <param name="codiceFonte">E' la fonte informativa dell'evento</param>
        public InizioPresaInCarico(RichiestaAssistenza richiesta, DateTime istante, string codiceFonte) : base(richiesta, istante, codiceFonte, "InizioPresaInCarico")
        {
        }
    }
}
