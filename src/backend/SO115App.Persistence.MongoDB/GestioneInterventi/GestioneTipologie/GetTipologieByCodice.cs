//-----------------------------------------------------------------------
// <copyright file="GetTipologieByCodice.cs" company="CNVVF">
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
using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.API.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.GestioneTipologie;
using System.Collections.Generic;

namespace SO115App.Persistence.MongoDB.GestioneInterventi.GestioneTipologie
{
    public class GetTipologieByCodice : IGetTipologieByCodice
    {
        private readonly DbContext _dbContext;

        public GetTipologieByCodice(DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public List<Tipologia> Get(List<string> codiciTipologie = null)
        {
            return codiciTipologie != null
                ? _dbContext.TipologieCollection.Find(Builders<Tipologia>.Filter.In("codice", codiciTipologie)).ToList()
                : _dbContext.TipologieCollection.Find(Builders<Tipologia>.Filter.Empty).ToList();
        }
    }
}
