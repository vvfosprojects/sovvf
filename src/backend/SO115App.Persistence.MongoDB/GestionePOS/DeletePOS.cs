﻿//-----------------------------------------------------------------------
// <copyright file="DeletePOS.cs" company="CNVVF">
// Copyright (C) 2021 - CNVVF
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
using SO115App.Models.Classi.Pos;
using SO115App.Models.Servizi.Infrastruttura.GestionePOS;

namespace SO115App.Persistence.MongoDB.GestionePOS
{
    public class DeletePOS : IDeletePos
    {
        private readonly DbContext _dbcontex;

        public DeletePOS(DbContext dbcontex)
        {
            _dbcontex = dbcontex;
        }

        public void Delete(string id)
        {
            _dbcontex.DtoPosCollection.DeleteOne(Builders<PosDAO>.Filter.Eq(x => x.Id, id));
        }
    }
}
