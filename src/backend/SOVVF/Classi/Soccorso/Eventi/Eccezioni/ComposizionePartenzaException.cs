// Copyright (C) 2017 - CNVVF
//
// This file is part of SOVVF. SOVVF is free software: you can redistribute it and/or modify it under
// the terms of the GNU Affero General Public License as published by the Free Software Foundation,
// either version 3 of the License, or (at your option) any later version.
//
// SOVVF is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even
// the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero
// General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License along with this program.
// If not, see <http://www.gnu.org/licenses/>.

using System;

namespace Modello.Classi.Soccorso.Eventi.Eccezioni
{
    /// <summary>
    ///   Classe base per le eccezioni sulla composizione della partenza
    /// </summary>
    public class ComposizionePartenzaException : ApplicationException
    {
        /// <summary>
        ///   Costruttore che accetta il messaggio
        /// </summary>
        /// <param name="message">Messaggio dell'eccezione</param>
        public ComposizionePartenzaException(string message) : base(message)
        {
        }

        /// <summary>
        ///   Costruttore che accetta il messaggio e l'eccezione interna
        /// </summary>
        /// <param name="message">Messaggio dell'eccezione</param>
        /// <param name="inner">Eccezione interna</param>
        public ComposizionePartenzaException(string message, Exception inner) : base(message, inner)
        {
        }
    }
}
