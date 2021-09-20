//-----------------------------------------------------------------------
// <copyright file="SaveDoc.cs" company="CNVVF">
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
using Persistence.MongoDB;
using SO115App.Models.Classi.Documentale;
using SO115App.Models.Servizi.Infrastruttura.GestioneDocumentale;
using System.IO;

namespace SO115App.Persistence.MongoDB.GestioneDocumentale
{
    public class SaveDoc : ISaveDoc
    {
        private readonly DbContext _dbcontex;

        public SaveDoc(DbContext dbcontex)
        {
            _dbcontex = dbcontex;
        }

        public void Save(DtoDocumentale documento)
        {
            var docNew = new DaoDocumentale()
            {
                CodSede = documento.CodSede,
                DescrizioneDocumento = documento.DescrizioneDocumento,
                DescrizioneCategoria = documento.DescrizioneCategoria,
                FDFile = ByteArrayConvert(documento.FDFile),
                FileName = documento.FileName
            };

            _dbcontex.DocumentaleCollection.InsertOne(docNew);
        }

        private byte[] ByteArrayConvert(IFormFile fDFile)
        {
            MemoryStream ms = new MemoryStream();
            fDFile.CopyTo(ms);
            return ms.ToArray();
        }
    }
}
