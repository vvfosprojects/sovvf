//-----------------------------------------------------------------------
// <copyright file="SquadraCoinvolta.cs" company="CNVVF">
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
namespace SO115App.API.Models.Classi.Soccorso
{
    /// <summary>
    ///   Contiene le informazioni sullo stato di un capopartenza coinvolto in un intervento di soccorso
    /// </summary>
    public class SquadraCoinvolta
    {
        /// <summary>
        ///   Enumera gli stati in cui un capopartenza partecipante ad una richiesta può trovarsi
        /// </summary>
        public enum StatoSquadraCoinvolta
        {
            /// <summary>
            ///   In viaggio verso il luogo del sinistro.
            /// </summary>
            InViaggio,

            /// <summary>
            ///   Giunta sul luogo del sinistro
            /// </summary>
            SulPosto,

            /// <summary>
            ///   In viaggio verso la sede di servizio
            /// </summary>
            InRientro,

            /// <summary>
            ///   Rientrata presso la sede di servizio
            /// </summary>
            RientrataInSede
        }

        /// <summary>
        ///   Il nome della squadra
        /// </summary>
        public string Nome { get; set; }

        /// <summary>
        ///   Lo stato della squadra
        /// </summary>
        public StatoSquadraCoinvolta StatoDellaSquadra { get; set; }
    }
}
