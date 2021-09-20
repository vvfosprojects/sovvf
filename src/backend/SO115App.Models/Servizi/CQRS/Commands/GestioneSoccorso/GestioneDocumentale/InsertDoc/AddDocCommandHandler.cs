﻿//-----------------------------------------------------------------------
// <copyright file="AddDocCommandHandler.cs" company="CNVVF">
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
using CQRS.Commands;
using SO115App.Models.Servizi.Infrastruttura.GestioneDocumentale;
using System.IO;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneDocumentale.InsertDoc
{
    public class AddDocCommandHandler : ICommandHandler<AddDocCommand>
    {
        internal string _resultPath { get => ResultPath; set => DirectoryCheck(value); }
        private string ResultPath;

        private readonly ISaveDoc _savePos;

        public AddDocCommandHandler(ISaveDoc savePos)
        {
            _savePos = savePos;
        }

        public void Handle(AddDocCommand command)
        {
            command.Documento.FileName = command.Documento.FDFile.FileName;

            _savePos.Save(command.Documento);
        }

        private void DirectoryCheck(string path)
        {
            if (!Directory.Exists(path))
                Directory.CreateDirectory(path);

            ResultPath = path;
        }
    }
}
