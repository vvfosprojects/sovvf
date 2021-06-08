//-----------------------------------------------------------------------
// <copyright file="EditPosCommandHandler.cs" company="CNVVF">
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
using Newtonsoft.Json;
using SO115App.Models.Classi.Pos;
using SO115App.Models.Servizi.Infrastruttura.GestionePOS;
using System.Collections.Generic;
using System.IO;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePOS.EditPos
{
    public class EditPosCommandHandler : ICommandHandler<EditPosCommand>
    {
        internal string _resultPath { get => ResultPath; set => DirectoryCheck(value); }
        private string ResultPath;

        private readonly IEditPos _editPos;

        public EditPosCommandHandler(IEditPos editPos) => _editPos = editPos;

        public void Handle(EditPosCommand command)
        {
            command.Pos.ListaTipologieConvert = JsonConvert.DeserializeObject<List<TipologiaPos>>(command.Pos.ListaTipologie);
            _editPos.Edit(command.Pos);
        }

        private void DirectoryCheck(string path)
        {
            if (!Directory.Exists(path))
                Directory.CreateDirectory(path);

            ResultPath = path;
        }
    }
}
