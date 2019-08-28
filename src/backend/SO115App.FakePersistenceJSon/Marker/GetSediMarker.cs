//-----------------------------------------------------------------------
// <copyright file="GetSediMarker.cs" company="CNVVF">
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
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Geo;
using SO115App.API.Models.Classi.Marker;
using SO115App.FakePersistence.JSon.Utility;
using SO115App.Models.Servizi.Infrastruttura.Marker;

namespace SO115App.FakePersistenceJSon.Marker
{
    public class GetSediMarker : IGetSediMarker
    {
        public List<SedeMarker> GetListaSediMarker(AreaMappa filtroAreaMappa)
        {
            List<SedeMarker> ListaSedi = new List<SedeMarker>();
            string filepath = CostantiJson.MarkerSedi;
            string json;
            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            List<SedeMarker> ListaSediMarker = JsonConvert.DeserializeObject<List<SedeMarker>>(json);

            foreach (SedeMarker sede in ListaSediMarker)
            {
                if (((sede.Coordinate.Latitudine >= filtroAreaMappa.BottomLeft.Latitudine) && (sede.Coordinate.Latitudine <= filtroAreaMappa.TopRight.Latitudine)) &&
                    ((sede.Coordinate.Longitudine >= filtroAreaMappa.BottomLeft.Longitudine) && (sede.Coordinate.Latitudine <= filtroAreaMappa.TopRight.Longitudine))
                  )
                {
                    ListaSedi.Add(sede);
                }
            }

            return ListaSedi;
        }
    }
}
