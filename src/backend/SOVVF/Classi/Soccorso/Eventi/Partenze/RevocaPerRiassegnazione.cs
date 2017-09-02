//-----------------------------------------------------------------------
// <copyright file="RevocaPerRiassegnazione.cs" company="CNVVF">
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

namespace Modello.Classi.Soccorso.Eventi.Partenze
{
    /// <summary>
    ///   Modella l'evento di revoca per riassegnazione mezzo ad altro intervento
    /// </summary>
    public class RevocaPerRiassegnazione : Revoca
    {
        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        /// <param name="richiesta">La richiesta a cui appartiene l'evento</param>
        /// <param name="richiestaSubentrata">
        ///   La richiesta che subentra nell'uso del mezzo, in seguito all'evento
        /// </param>
        /// <param name="codiceMezzo">Il codice mezzo relativo all'evento</param>
        /// <param name="istante">L'istante in cui l'evento si verifica</param>
        /// <param name="codiceFonte">La fonte informativa dell'evento</param>
        public RevocaPerRiassegnazione(
            RichiestaAssistenza richiesta,
            RichiestaAssistenza richiestaSubentrata,
            string codiceMezzo,
            DateTime istante,
            string codiceFonte) : base(richiesta, codiceMezzo, istante, codiceFonte)
        {
            if (richiestaSubentrata == null)
            {
                throw new ArgumentNullException("Un evento di RevocaPerRiassegnazione deve indicare la richiesta subentrata", nameof(richiestaSubentrata));
            }

            this.RichiestaSubentrata = richiestaSubentrata;
        }

        /// <summary>
        ///   La richiesta che subentra nell'uso del mezzo
        /// </summary>
        public RichiestaAssistenza RichiestaSubentrata { get; private set; }
    }
}
