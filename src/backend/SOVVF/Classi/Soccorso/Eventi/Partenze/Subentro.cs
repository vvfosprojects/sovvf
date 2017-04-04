//-----------------------------------------------------------------------
// <copyright file="Subentro.cs" company="CNVVF">
// Copyright (C) 2017 - CNVVF
// </copyright>
//-----------------------------------------------------------------------
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
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

namespace Modello.Classi.Soccorso.Eventi.Partenze
{
    /// <summary>
    ///   Eventuale dirottamento in fase di rientro della <see cref="ComposizionePartenza"></see>
    ///   presso un'altra Richiesta di assistenza, piuttosto che rientrare in sede. (valido da dopo
    ///   PartenzaInRientro )
    /// </summary>
    /// <remarks>Lo sganciamento ha senso solo per <see cref="SoccorsoOrdinario"></see>.</remarks>
    public class Subentro : Evento
    {
    }
}
