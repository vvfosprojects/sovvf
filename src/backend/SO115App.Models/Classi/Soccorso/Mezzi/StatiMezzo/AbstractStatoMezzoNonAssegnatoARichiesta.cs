//-----------------------------------------------------------------------
// <copyright file="AbstractStatoMezzoNonAssegnatoARichiesta.cs" company="CNVVF">
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

namespace SO115App.API.Models.Classi.Soccorso.Mezzi.StatiMezzo
{
    /// <summary>
    ///   Modella uno stato mezzo in cui il mezzo non è assegnato ad una <see cref="RichiestaAssistenza" />.
    /// </summary>
    public abstract class AbstractStatoMezzoNonAssegnatoARichiesta : AbstractStatoMezzo
    {
        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        /// <param name="istanteTransizione">
        ///   L'istante in cui avviene la transizione in questo stato
        /// </param>
        public AbstractStatoMezzoNonAssegnatoARichiesta(DateTime istanteTransizione) : base(istanteTransizione)
        {
        }

        /// <summary>
        ///   Negli stati derivati da questa classe astratta, il mezzo non è assegnato ad una
        ///   richiesta per definizione
        /// </summary>
        public sealed override bool AssegnatoARichiesta
        {
            get
            {
                return false;
            }
        }
    }
}
