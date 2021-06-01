//-----------------------------------------------------------------------
// <copyright file="EditPOS.cs" company="CNVVF">
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
using Microsoft.AspNetCore.Http;
using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.Models.Classi.Pos;
using SO115App.Models.Servizi.Infrastruttura.GestionePOS;
using System.IO;

namespace SO115App.Persistence.MongoDB.GestionePOS
{
    public class EditPOS : IEditPos
    {
        private readonly DbContext _dbcontex;

        public EditPOS(DbContext dbcontex)
        {
            _dbcontex = dbcontex;
        }

        public void Edit(DtoPos pos)
        {
            var posNew = new PosDAO()
            {
                CodSede = pos.CodSede,
                DescrizionePos = pos.DescrizionePos,
                FDFile = ByteArrayConvert(pos.FDFile),
                ListaTipologie = pos.ListaTipologieConvert
            };

            var filter = Builders<PosDAO>.Filter.Eq(s => s.Id, pos.Id);

            _dbcontex.DtoPosCollection.ReplaceOne(filter, posNew);
        }

        private byte[] ByteArrayConvert(IFormFile fDFile)
        {
            MemoryStream ms = new MemoryStream();
            fDFile.CopyTo(ms);
            return ms.ToArray();
        }
    }
}
