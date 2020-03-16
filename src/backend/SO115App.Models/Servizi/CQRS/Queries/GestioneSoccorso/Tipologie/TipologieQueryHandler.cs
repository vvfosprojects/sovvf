//-----------------------------------------------------------------------
// <copyright file="TipologieQueryHandler.cs" company="CNVVF">
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
using CQRS.Queries;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.GestioneTipologie;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Tipologie;
using System;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.Tipologie
{
    public class TipologieQueryHandler : IQueryHandler<TipologieQuery, TipologieResult>
    {
        private readonly IGetTipologieByCodice _getTipologie;

        public TipologieQueryHandler(IGetTipologieByCodice getTipologie)
        {
            _getTipologie = getTipologie;
        }

        public TipologieResult Handle(TipologieQuery query)
        {

            List<string> listaSedi = new List<string>()
            {
                query.CodSede
            };

            return new TipologieResult
            {
                Tipologie = _getTipologie.Get(listaSedi)
            };
        }
    }
}
