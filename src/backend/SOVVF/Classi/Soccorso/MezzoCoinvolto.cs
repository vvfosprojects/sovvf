//-----------------------------------------------------------------------
// <copyright file="MezzoCoinvolto.cs" company="CNVVF">
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
namespace Modello.Classi.Soccorso
{
    /// <summary>
    ///   Contiene le informazioni sullo stato di un mezzo coinvolto in un intervento di soccorso
    /// </summary>
    public class MezzoCoinvolto
    {
        /// <summary>
        ///   Enumera gli stati in cui un mezzo partecipante ad una richiesta può trovarsi
        /// </summary>
        public enum StatoMezzo
        {
            /// <summary>
            ///   Assegnato ma non ancora partito
            /// </summary>
            Assegnato,

            /// <summary>
            ///   In viaggio verso il luogo del sinistro.
            /// </summary>
            InViaggio,

            /// <summary>
            ///   Giunto sul luogo del sinistro
            /// </summary>
            SulPosto,

            /// <summary>
            ///   In viaggio verso la sede di servizio
            /// </summary>
            InRientro,

            /// <summary>
            ///   Rientrato presso la sede di servizio
            /// </summary>
            RientratoInSede
        }

        /// <summary>
        ///   Il codice del mezzo
        /// </summary>
        public string CodiceMezzo { get; set; }

        /// <summary>
        ///   Lo stato del mezzo
        /// </summary>
        public StatoMezzo StatoDelMezzo { get; set; }
    }
}
