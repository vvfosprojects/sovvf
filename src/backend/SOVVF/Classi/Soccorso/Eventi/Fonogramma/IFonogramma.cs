//-----------------------------------------------------------------------
// <copyright file="IFonogramma.cs" company="CNVVF">
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
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modello.Classi.Soccorso.Eventi.Fonogramma
{
    /// <summary>
    ///   Interfaccia di un evento che riguarda il trattamento dei fonogrammi per una <see cref="RichiestaAssistenza" />.
    /// </summary>
    /// <remarks>
    ///   Il termine "fonogramma" storicamente identifica una comunicazione ad enti esterni al fine
    ///   di notificare l'evento ed eventuali altre informazioni collegate. Attualmente avviene
    ///   mediante PEC.
    /// </remarks>
    public interface IFonogramma : IEvento
    {
    }
}
