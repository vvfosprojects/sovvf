//-----------------------------------------------------------------------
// <copyright file="GetMezziMarker.cs" company="CNVVF">
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
    public class GetMezziMarker : IGetMezziMarker
    {
        public List<MezzoMarker> GetListaMezziMarker(AreaMappa filtroAreaMappa)
        {
            List<MezzoMarker> ListaMezzi = new List<MezzoMarker>();
            string filepath = CostantiJson.MezziComposizione;
            string json;
            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            List<MezzoMarker> ListaMezziMarker = JsonConvert.DeserializeObject<List<MezzoMarker>>(json);

            foreach (MezzoMarker mezzo in ListaMezziMarker)
            {
                if (((mezzo.Coordinate.Latitudine >= filtroAreaMappa.BottomLeft.Latitudine) && (mezzo.Coordinate.Latitudine <= filtroAreaMappa.TopRight.Latitudine)) &&
                    ((mezzo.Coordinate.Longitudine >= filtroAreaMappa.BottomLeft.Longitudine) && (mezzo.Coordinate.Latitudine <= filtroAreaMappa.TopRight.Longitudine))
                  )
                {
                    ListaMezzi.Add(mezzo);
                }
            }

            return ListaMezzi;
        }
    }
}
