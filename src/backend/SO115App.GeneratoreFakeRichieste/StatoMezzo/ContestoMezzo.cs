//-----------------------------------------------------------------------
// <copyright file="ContestoMezzo.cs" company="CNVVF">
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
namespace SO115App.GeneratoreRichiesteFake.StatoMezzo
{
    /// <summary>
    ///   Il contesto in cui un mezzo si trova (pattern state)
    /// </summary>
    internal class ContestoMezzo
    {
        /// <summary>
        ///   Il costruttore della classe
        /// </summary>
        public ContestoMezzo()
        {
            this.State = new InSede();
        }

        /// <summary>
        ///   L'istanza dello stato corrente per il mezzo
        /// </summary>
        public IStatoMezzo State { get; set; }

        /// <summary>
        ///   Invia al mezzo l'evento di composizione
        /// </summary>
        public void Composizione()
        {
            this.State.Composizione(this);
        }

        /// <summary>
        ///   Invia al mezzo l'evento di arrivo in sede
        /// </summary>
        public void InSede()
        {
            this.State.InSede(this);
        }

        /// <summary>
        ///   Invia al mezzo l'evento di uscita dalla sede
        /// </summary>
        public void Uscita()
        {
            this.State.Uscita(this);
        }

        /// <summary>
        ///   Invia al mezzo l'evento di rientro in sede
        /// </summary>
        public void Rientro()
        {
            this.State.Rientro(this);
        }

        /// <summary>
        ///   Invia al mezzo l'evento di arrivo sul luogo del sinistro
        /// </summary>
        public void SulPosto()
        {
            this.State.SulPosto(this);
        }
    }
}