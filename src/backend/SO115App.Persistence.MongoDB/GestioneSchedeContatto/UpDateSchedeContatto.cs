//-----------------------------------------------------------------------
// <copyright file="UpDateRichiesta.cs" company="CNVVF">
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
using SO115App.Models.Classi.NUE;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue;

namespace SO115App.Persistence.MongoDB
{
    public class UpDateSchedeContatto : IMergeSchedeContatto
    {
        private readonly DbContext _dbContext;

        public UpDateSchedeContatto(DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public void Merge(SchedaContatto scheda, string codiceSede)
        {
            var filter = Builders<SchedaContatto>.Filter.Eq(s => s.CodiceScheda, scheda.CodiceScheda);

            var replaceOption = new ReplaceOptions();
            replaceOption.IsUpsert = true;

            _dbContext.SchedeContattoCollection.InsertOne(scheda);

            foreach (var schedaMergiata in scheda.Collegate)
            {
                var filterMerged = Builders<SchedaContatto>.Filter.Eq(s => s.CodiceScheda, schedaMergiata.CodiceScheda);
                _dbContext.SchedeContattoCollection.InsertOne(schedaMergiata);
            }
        }
    }
}
