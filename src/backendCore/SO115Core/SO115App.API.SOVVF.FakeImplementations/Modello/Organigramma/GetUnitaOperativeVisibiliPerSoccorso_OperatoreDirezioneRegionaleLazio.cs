//-----------------------------------------------------------------------
// <copyright file="GetUnitaOperativeVisibiliPerSoccorso_OperatoreDirezioneRegionaleLazio.cs" company="CNVVF">
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
using SO115App.API.Models.Servizi.Infrastruttura.Organigramma;

namespace SO115App.API.SOVVF.FakeImplementations.Modello.Organigramma
{
    /// <summary>
    ///   Questa classe simula la restituzione delle unità operative visibili da un operatore del
    ///   soccorso appartenente alla Direzione Regionale Lazio.
    /// </summary>
    internal class GetUnitaOperativeVisibiliPerSoccorso_OperatoreDirezioneRegionaleLazio : IGetUnitaOperativeVisibiliPerSoccorso
    {
        /// <summary>
        ///   Istanza del servizio
        /// </summary>
        private readonly IGetUnitaOperativaRadice getUnitaOperativaRadice;

        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        /// <param name="getUnitaOperativaRadice">Istanza del servizio</param>
        public GetUnitaOperativeVisibiliPerSoccorso_OperatoreDirezioneRegionaleLazio(IGetUnitaOperativaRadice getUnitaOperativaRadice)
        {
            this.getUnitaOperativaRadice = getUnitaOperativaRadice;
        }

        /// <summary>
        ///   Restituisce i codici delle unità operative
        /// </summary>
        /// <returns>I codici delle unità operative</returns>
        public IEnumerable<string> Get()
        {
            return this.getUnitaOperativaRadice.Get()
                .GetSottoAlbero(new PinNodo[]
                {
                    new PinNodo("DR_LAZ", true)
                })
                .Select(n => n.Codice);
        }
    }
}
