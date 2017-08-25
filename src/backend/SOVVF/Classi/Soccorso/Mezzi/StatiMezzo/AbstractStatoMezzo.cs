//-----------------------------------------------------------------------
// <copyright file="AbstractStatoMezzo.cs" company="CNVVF">
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
using Modello.Classi.Soccorso.Eventi.Partenze;

namespace Modello.Classi.Soccorso.Mezzi.StatiMezzo
{
    /// <summary>
    ///   La classe base per tutti gli <see cref="IStatoMezzo" />
    /// </summary>
    public abstract class AbstractStatoMezzo : IStatoMezzo
    {
        /// <summary>
        ///   Uno stato mezzo, con maggiore probabilità, implica l'assegnazione del mezzo alla
        ///   richiesta. Gli stati che contravvengono questa consuetudine sono tenuti a fare
        ///   l'override di questo metodo della classe base.
        /// </summary>
        public virtual bool AssegnatoARichiesta
        {
            get
            {
                return true;
            }
        }

        /// <summary>
        ///   Il codice identificativo dello stato
        /// </summary>
        public abstract string Codice { get; }

        /// <summary>
        ///   Indica se il mezzo è disponibile in questo stato
        /// </summary>
        public abstract bool Disponibile { get; }

        /// <summary>
        ///   Calcola la transizione di stato ottenuta in seguito al verificarsi di un evento
        /// </summary>
        /// <param name="evento">L'evento che induce la transizione di stato</param>
        /// <returns>Il nuovo stato raggiunto a seguito della transizione</returns>
        public IStatoMezzo Transisci(IPartenza evento)
        {
            throw new NotImplementedException();
        }
    }
}
