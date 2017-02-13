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
using System.Collections.Generic;
using System.Linq;
using Modello.Classi.Soccorso.Eventi.Eccezioni;

namespace Modello.Classi.Soccorso.Risorse
{
    /// <summary>
    ///   Questa classe rappresenta la selezione di una risorsa ad una <see cref="RichiestaAssistenza" />.
    /// </summary>
    /// <remarks>La risorsa selezionata non sarà selezionabile da altri operatori.</remarks>
    public class SelezioneRisorsa
    {
        /// <summary>
        ///   Istante di selezione della risorsa.
        /// </summary>
        public DateTime IstanteSelezione { get; set; }

        /// <summary>
        ///   Operatore che effettua la selezione.
        /// </summary>
        public string Operatore { get; set; }
    }
}
