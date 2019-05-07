//-----------------------------------------------------------------------
// <copyright file="GetUnitaOperativaPerCodice.cs" company="CNVVF">
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
using SO115App.API.Models.Classi.Organigramma;

namespace SO115App.API.Models.Servizi.Infrastruttura.Organigramma.Implementazioni
{
    /// <summary>
    ///   Implementa l'interfaccia <see cref="IGetUnitaOperativaPerCodice" /> attraverso una mappa
    ///   immutabile costruita mediante accesso al servizio <see cref="IGetUnitaOperativaRadice" />.
    /// </summary>
    public class GetUnitaOperativaPerCodice : IGetUnitaOperativaPerCodice
    {
        /// <summary>
        ///   La mappa immutabile contenente l'associazione Codice =&gt; Unità Operativa.
        /// </summary>
        private readonly Dictionary<string, UnitaOperativa> mappaUnitaOperativePerCodice;

        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        /// <param name="getUnitaOperativaRadice">
        ///   Il servizio per l'accesso all' <see cref="UnitaOperativa" /> radice.
        /// </param>
        public GetUnitaOperativaPerCodice(IGetUnitaOperativaRadice getUnitaOperativaRadice)
        {
            this.mappaUnitaOperativePerCodice = getUnitaOperativaRadice.Get()
                .GetSottoAlbero()
                .ToDictionary(key => key.Codice, value => value);
        }

        /// <summary>
        ///   Restituisce l'unità operativa avente il codice dato.
        /// </summary>
        /// <param name="codice">Il codice dell'unita operativa.</param>
        /// <returns>L'unita operativa.</returns>
        public UnitaOperativa Get(string codice)
        {
            return this.mappaUnitaOperativePerCodice[codice];
        }
    }
}
