//-----------------------------------------------------------------------
// <copyright file="WorkflowException.cs" company="CNVVF">
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

namespace Modello.Classi.Soccorso.Eventi.Eccezioni
{
    /// <summary>
    ///   Eccezione che indica il verificarsi di una transizione vietata in uno state diagram
    /// </summary>
    [Serializable]
    public class WorkflowException : Exception
    {
        /// <summary>
        ///   Costruttore di default
        /// </summary>
        public WorkflowException()
        {
        }

        /// <summary>
        ///   Costruttore con messaggio
        /// </summary>
        /// <param name="message">Il messaggio dell'eccezione</param>
        public WorkflowException(string message)
            : base(message)
        {
        }

        /// <summary>
        ///   Costruttore con messaggio ed eccezione successiva nello stack
        /// </summary>
        /// <param name="message">Il messaggio dell'eccezione</param>
        /// <param name="innerException">L'eccezione successiva nello stack</param>
        public WorkflowException(string message, Exception innerException)
            : base(message, innerException)
        {
        }
    }
}
