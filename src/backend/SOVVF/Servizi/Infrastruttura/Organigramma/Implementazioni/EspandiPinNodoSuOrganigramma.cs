//-----------------------------------------------------------------------
// <copyright file="EspandiPinNodoSuOrganigramma.cs" company="CNVVF">
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
using System.Collections.Generic;
using System.Linq;
using Modello.Classi.Organigramma;

namespace Modello.Servizi.Infrastruttura.Organigramma.Implementazioni
{
    /// <summary>
    ///   Implementazione del servizio di espansione dei pins su organigramma.
    /// </summary>
    internal class EspandiPinNodoSuOrganigramma : IEspandiPinNodoSuOrganigramma
    {
        /// <summary>
        ///   L'istanza del servizio <see cref="IGetUnitaOperativaRadice" />
        /// </summary>
        private readonly IGetUnitaOperativaRadice getUnitaOperativaRadice;

        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        /// <param name="getUnitaOperativaRadice">L'istanza del servizio <see cref="IGetUnitaOperativaRadice" /></param>
        public EspandiPinNodoSuOrganigramma(IGetUnitaOperativaRadice getUnitaOperativaRadice)
        {
            this.getUnitaOperativaRadice = getUnitaOperativaRadice;
        }

        /// <summary>
        ///   Espande la lista dei pins forniti in ingresso
        /// </summary>
        /// <param name="pinsNodo">I pins da espandere</param>
        /// <returns>La lista espansa dei codici unità operativa</returns>
        public IEnumerable<string> Espandi(IEnumerable<PinNodo> pinsNodo)
        {
            return this.getUnitaOperativaRadice.Get()
                .GetSottoAlbero(pinsNodo)
                .Select(n => n.Codice);
        }
    }
}
