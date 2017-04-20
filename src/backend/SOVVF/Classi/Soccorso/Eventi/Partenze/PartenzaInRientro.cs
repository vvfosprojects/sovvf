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
using Modello.Classi.Soccorso.Mezzi.StatiMezzo;

namespace Modello.Classi.Soccorso.Eventi.Partenze
{
    /// <summary>
    ///   Modella il rientro dal luogo della richiesta di assistenza di una partenza.
    /// </summary>
    /// <remarks>
    ///   Il "rientro" consiste per esempio nel lasciare il luogo della richiesta di assistenza
    /// </remarks>
    public class PartenzaInRientro : Evento, IPartenza
    {
        /// <summary>
        ///   E' l'identificativo del mezzo a cui è associato l'evento
        /// </summary>
        public string CodiceMezzo { get; set; }

        /// <summary>
        ///   Restituisce i codici dei mezzi coinvolti in questo evento
        /// </summary>
        string[] IPartenza.CodiciMezzo
        {
            get
            {
                return new string[] { this.CodiceMezzo };
            }
        }

        /// <summary>
        ///   Restituisce lo stato che il mezzo assume a seguito del verificarsi dell'evento
        /// </summary>
        /// <returns>Lo stato del mezzo</returns>
        IStatoMezzo IPartenza.GetStatoMezzo()
        {
            return new InRientro();
        }
    }
}
