//-----------------------------------------------------------------------
// <copyright file="AbstractStatoMezzoAssegnatoARichiesta.cs" company="CNVVF">
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

namespace Modello.Classi.Soccorso.Mezzi.StatiMezzo
{
    /// <summary>
    ///   Modella uno stato mezzo in cui il mezzo è assegnato ad una <see cref="RichiestaAssistenza" />.
    /// </summary>
    public abstract class AbstractStatoMezzoAssegnatoARichiesta : AbstractStatoMezzo, IStatoMezzoAssegnatoARichiesta
    {
        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        /// <param name="istanteTransizione">
        ///   L'istante in cui avviene la transizione in questo stato
        /// </param>
        /// <param name="codiceRichiesta">
        ///   Il codice della richiesta proprietaria dell'evento che ha provocato la transizione in
        ///   questo stato
        /// </param>
        public AbstractStatoMezzoAssegnatoARichiesta(DateTime istanteTransizione, string codiceRichiesta) : base(istanteTransizione)
        {
            this.CodiceRichiesta = codiceRichiesta;
        }

        /// <summary>
        ///   Il codice della richiesta proprietaria dell'evento che ha provocato la transizione in
        ///   questo stato
        /// </summary>
        public string CodiceRichiesta { get; private set; }

        /// <summary>
        ///   Negli stati derivati da questa classe astratta, il mezzo è assegnato ad una richiesta
        ///   per definizione
        /// </summary>
        public sealed override bool AssegnatoARichiesta
        {
            get
            {
                return true;
            }
        }
    }
}
