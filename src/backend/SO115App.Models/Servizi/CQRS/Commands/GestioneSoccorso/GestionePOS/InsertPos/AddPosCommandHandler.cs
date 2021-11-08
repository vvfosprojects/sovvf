//-----------------------------------------------------------------------
// <copyright file="AddPosCommandHandler.cs" company="CNVVF">
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
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using SO115App.Models.Classi.Pos;
using SO115App.Models.Servizi.Infrastruttura.GestionePOS;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePOS.InsertPos
{
    public class AddPosCommandHandler : ICommandHandler<AddPosCommand>
    {
        internal string _resultPath { get => ResultPath; set => DirectoryCheck(value); }
        private string ResultPath;

        private readonly ISavePos _savePos;
        private readonly IConfiguration _config;
        private readonly IWebHostEnvironment _env;

        public AddPosCommandHandler(ISavePos savePos, IConfiguration config, IWebHostEnvironment env)
        {
            _savePos = savePos;
            _config = config;
            _env = env;
        }

        public void Handle(AddPosCommand command)
        {
            command.Pos.FileName = command.Pos.FDFile.FileName;
            command.Pos.ListaTipologieConvert = JsonConvert.DeserializeObject<List<TipologiaPos>>(command.Pos.ListaTipologie);

            _savePos.Save(command.Pos);
        }

        private void DirectoryCheck(string path)
        {
            if (!Directory.Exists(path))
                Directory.CreateDirectory(path);

            ResultPath = path;
        }
    }
}
