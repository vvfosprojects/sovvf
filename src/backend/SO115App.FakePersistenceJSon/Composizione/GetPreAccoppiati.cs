//-----------------------------------------------------------------------
// <copyright file="GetPreAccoppiati.cs" company="CNVVF">
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
using System.Collections.Generic;
using System.IO;
using System.Linq;
using DomainModel.CQRS.Commands.PreAccoppiati;
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Composizione;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.PreAccoppiati;
using SO115App.Models.Servizi.Infrastruttura.GetPreAccoppiati;

namespace SO115App.FakePersistenceJSon.Composizione
{
    public class GetPreAccoppiati : IGetPreAccoppiati
    {
        public List<PreAccoppiati> Get(PreAccoppiatiCommand command)
        {
            List<PreAccoppiati> preAccoppiati = new List<PreAccoppiati>();
            string filepath = "Fake/PreAccoppiatiComposizione.json";
            string json;
            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            preAccoppiati = JsonConvert.DeserializeObject<List<PreAccoppiati>>(json);

            return preAccoppiati.Where(x => x.CodiceSede == command.CodiceSede).ToList();
        }
    }
}
