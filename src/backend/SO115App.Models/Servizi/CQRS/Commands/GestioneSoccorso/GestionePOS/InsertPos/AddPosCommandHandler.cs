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
using Microsoft.Extensions.Configuration;
using SO115App.Models.Servizi.Infrastruttura.GestionePOS;
using System.IO;
using System.Text;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePOS.InsertPos
{
    public class AddPosCommandHandler : ICommandHandler<AddPosCommand>
    {
        private readonly ISavePos _savePos;
        private readonly IConfiguration _config;

        public AddPosCommandHandler(ISavePos savePos, IConfiguration config)
        {
            _savePos = savePos;
            _config = config;
        }

        public void Handle(AddPosCommand command)
        {
            var PathFile = _config.GetSection("GenericSettings").GetSection("PathfilePOS").Value;
            var PathDirectory = PathFile + "\\" + command.Pos.CodSede;
            var PathCompleto = PathDirectory + "\\" + command.Pos.FileName;
            //Creo una directory con il nome della sede qualora non esistesse
            if (!Directory.Exists(PathDirectory))
                Directory.CreateDirectory(PathDirectory);

            using (FileStream fs = File.Create(PathCompleto))
            {
                byte[] pos = command.Pos.FSFile;
                fs.Write(pos, 0, pos.Length);
            }

            command.Pos.FilePath = PathCompleto;

            _savePos.Save(command.Pos);
        }
    }
}
