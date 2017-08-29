//-----------------------------------------------------------------------
// <copyright file="PartenzaInRientro.cs" company="CNVVF">
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
using Modello.Classi.Soccorso.Mezzi.StatiMezzo;

namespace Modello.Classi.Soccorso.Eventi.Partenze
{
    /// <summary>
    ///   Modella il rientro dal luogo della richiesta di assistenza di una partenza.
    /// </summary>
    /// <remarks>
    ///   Il "rientro" consiste per esempio nel lasciare il luogo della richiesta di assistenza
    /// </remarks>
    public class PartenzaInRientro : AbstractPartenza
    {
        /// <summary>
        ///   Costruttore della classe.
        /// </summary>
        /// <param name="richiesta">E' la richiesta di assistenza a cui si aggiunge l'evento</param>
        /// <param name="codiceMezzo">Il codice del mezzo</param>
        /// <param name="istante">E' l'istante in cui si verifica l'evento</param>
        /// <param name="codiceFonte">E' la fonte informativa dell'evento</param>
        public PartenzaInRientro(
            RichiestaAssistenza richiesta,
            string codiceMezzo,
            DateTime istante,
            string codiceFonte) : base(richiesta, codiceMezzo, istante, codiceFonte)
        {
        }
    }
}
