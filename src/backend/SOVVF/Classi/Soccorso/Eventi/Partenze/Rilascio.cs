//-----------------------------------------------------------------------
// <copyright file="Rilascio.cs" company="CNVVF">
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
using System.Linq;
using Modello.Classi.Soccorso.Mezzi.StatiMezzo;

namespace Modello.Classi.Soccorso.Eventi.Partenze
{
    /// <summary>
    ///   Indica il rilascio della <see cref="ComposizionePartenze"></see> da una Richiesta di
    ///   assistenza. (valido da dopo la <see cref="ComposizionePartenze" /> fino a
    ///   <see cref="PartenzaInRientro" /> inclusa)
    /// </summary>
    public abstract class Rilascio : Evento, IPartenza
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
                return Enumerable.Repeat(this.CodiceMezzo, 1).ToArray();
            }
        }

        /// <summary>
        ///   Restituisce lo stato che il mezzo assume a seguito del verificarsi dell'evento
        /// </summary>
        /// <returns>Lo stato del mezzo</returns>
        IStatoMezzo IPartenza.GetStatoMezzo()
        {
            return new InViaggio();
        }
    }
}
