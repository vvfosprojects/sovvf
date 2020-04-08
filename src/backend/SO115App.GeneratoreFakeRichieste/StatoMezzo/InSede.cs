//-----------------------------------------------------------------------
// <copyright file="InSede.cs" company="CNVVF">
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

namespace SO115App.GeneratoreRichiesteFake.StatoMezzo
{
    /// <summary>
    ///   Indica lo stato in sede per un mezzo (pattern state)
    /// </summary>
    internal class InSede : IStatoMezzo
    {
        /// <summary>
        ///   Indica se il mezzo, in questo stato, è da considerarsi disponibile.
        /// </summary>
        public bool Disponibile
        {
            get
            {
                return true;
            }
        }

        /// <summary>
        ///   Invia al mezzo l'evento di composizione
        /// </summary>
        /// <param name="context">Il contesto corrente del mezzo</param>
        public void Composizione(ContestoMezzo context)
        {
            context.State = new Assegnato();
        }

        /// <summary>
        ///   Invia al mezzo l'evento di arrivo in sede
        /// </summary>
        /// <param name="context">Il contesto corrente del mezzo</param>
        void IStatoMezzo.InSede(ContestoMezzo context)
        {
            throw new InvalidOperationException();
        }

        /// <summary>
        ///   Invia al mezzo l'evento di rientro in sede
        /// </summary>
        /// <param name="context">Il contesto corrente del mezzo</param>
        public void Rientro(ContestoMezzo context)
        {
            throw new InvalidOperationException();
        }

        /// <summary>
        ///   Invia al mezzo l'evento di arrivo sul luogo del sinistro
        /// </summary>
        /// <param name="context">Il contesto corrente del mezzo</param>
        public void SulPosto(ContestoMezzo context)
        {
            throw new InvalidOperationException();
        }

        /// <summary>
        ///   Invia al mezzo l'evento di uscita dalla sede
        /// </summary>
        /// <param name="context">Il contesto corrente del mezzo</param>
        public void Uscita(ContestoMezzo context)
        {
            throw new InvalidOperationException();
        }
    }
}
