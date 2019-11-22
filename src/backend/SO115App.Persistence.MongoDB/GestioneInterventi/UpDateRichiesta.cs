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
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using System.Text;

namespace SO115App.Persistence.MongoDB
{
    public class UpDateRichiesta : IUpDateRichiestaAssistenza
    {
        private readonly DbContext _dbContext;

        public UpDateRichiesta(DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public void UpDate(RichiestaAssistenza richiestaAssistenza)
        {
            var filter = Builders<RichiestaAssistenza>.Filter.Eq(s => s.Codice, richiestaAssistenza.Codice);
            _dbContext.RichiestaAssistenzaCollection.ReplaceOne(filter, richiestaAssistenza);
        }
    }
}
