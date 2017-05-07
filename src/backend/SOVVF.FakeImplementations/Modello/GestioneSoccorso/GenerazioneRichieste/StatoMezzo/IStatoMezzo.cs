//-----------------------------------------------------------------------
// <copyright file="IStatoMezzo.cs" company="CNVVF">
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

namespace SOVVF.FakeImplementations.Modello.GestioneSoccorso.GenerazioneRichieste.StatoMezzo
{
    /// <summary>
    ///   Indica lo stato corrente del mezzo
    /// </summary>
    internal interface IStatoMezzo
    {
        /// <summary>
        ///   Indica se il mezzo è disponibile nello stato corrente
        /// </summary>
        bool Disponibile { get; }

        /// <summary>
        ///   Invia al mezzo l'evento di composizione
        /// </summary>
        /// <param name="context">Il contesto corrente del mezzo</param>
        void Composizione(ContestoMezzo context);

        /// <summary>
        ///   Invia al mezzo l'evento di arrivo in sede
        /// </summary>
        /// <param name="context">Il contesto corrente del mezzo</param>
        void InSede(ContestoMezzo context);

        /// <summary>
        ///   Invia al mezzo l'evento di rientro in sede
        /// </summary>
        /// <param name="context">Il contesto corrente del mezzo</param>
        void Rientro(ContestoMezzo context);

        /// <summary>
        ///   Invia al mezzo l'evento di arrivo sul luogo del sinistro
        /// </summary>
        /// <param name="context">Il contesto corrente del mezzo</param>
        void SulPosto(ContestoMezzo context);

        /// <summary>
        ///   Invia al mezzo l'evento di uscita dalla sede
        /// </summary>
        /// <param name="context">Il contesto corrente del mezzo</param>
        void Uscita(ContestoMezzo context);
    }
}
