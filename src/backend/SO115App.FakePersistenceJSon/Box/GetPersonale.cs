//-----------------------------------------------------------------------
// <copyright file="GetPersonale.cs" company="CNVVF">
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
using System.IO;
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Boxes;
using SO115App.Models.Servizi.Infrastruttura.Box;

namespace SO115App.FakePersistenceJSon.Box
{
    public class GetPersonale : IGetBoxPersonale
    {
        public BoxPersonale Get()
        {
            BoxPersonale personale = new BoxPersonale();

            string filepath = "Fake/ListaPersonale.json";
            string json;
            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            personale = JsonConvert.DeserializeObject<BoxPersonale>(json);

            return personale;
        }
    }
}
