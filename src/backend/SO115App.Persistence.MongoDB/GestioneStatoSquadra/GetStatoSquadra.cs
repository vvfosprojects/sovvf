//-----------------------------------------------------------------------
// <copyright file="GetStatoSquadra.cs" company="CNVVF">
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
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.GestioneStatoOperativoSquadra;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.Persistence.MongoDB.GestioneStatoSquadra
{
    public class GetStatoSquadra : IGetStatoSquadra
    {
        /// <summary>
        ///   classe che estende il servizio di reperimento degli stati operativi delle squadre ed
        ///   effettua la query su MongoDB
        /// </summary>
        private readonly DbContext _dbContext;

        /// <summary>
        ///   costruttore della classe
        /// </summary>
        /// <param name="dbContext">il contesto del db</param>
        public GetStatoSquadra(DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        /// <summary>
        ///   metodo della classe che effettua la query
        /// </summary>
        /// <param name="codiceSede">opzionale, rappresenta il codice sede delle squadre</param>
        /// <returns>una lista di stati operativi</returns>
        public List<StatoOperativoSquadra> Get(List<string> codiciSede = null)
        {
            if (codiciSede.Any())
                return _dbContext.StatoSquadraCollection.Find(Builders<StatoOperativoSquadra>.Filter.In(x => x.CodiceSede, codiciSede)).ToList();
            return _dbContext.StatoSquadraCollection.Find(Builders<StatoOperativoSquadra>.Filter.Empty).ToList();
        }
    }
}
