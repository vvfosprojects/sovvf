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
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Geo;
using SO115App.API.Models.Classi.Marker;
using SO115App.FakePersistence.JSon.Classi;
using SO115App.FakePersistence.JSon.Utility;
using SO115App.FakePersistenceJSon.Utility;
using SO115App.Models.Servizi.Infrastruttura.Marker;

namespace SO115App.FakePersistenceJSon.Marker
{
    public class GetMezziMarker : IGetMezziMarker
    {
        public List<MezzoMarker> GetListaMezziMarker(AreaMappa filtroAreaMappa)
        {
            MapFromFlottaToMezziMarker mapper = new MapFromFlottaToMezziMarker();
            List<MezzoMarker> ListaMezzi = new List<MezzoMarker>();
            List<MezzoMarker> ListaMezziFilter = new List<MezzoMarker>();

            string filepath = CostantiJson.FlottaMezzi;
            string json;
            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            try
            {
                List<MapperMezziFromGeoFleet> FlottaMezzi = JsonConvert.DeserializeObject<List<MapperMezziFromGeoFleet>>(json);
                ListaMezzi = mapper.MappaFlottaMezziSuMezziMarker(FlottaMezzi);

                if (filtroAreaMappa == null)
                    return ListaMezziFilter = ListaMezzi;
                else
                {
                    foreach (MezzoMarker mezzo in ListaMezzi)
                    {
                        if (((mezzo.Coordinate.Latitudine >= filtroAreaMappa.BottomLeft.Latitudine) && (mezzo.Coordinate.Latitudine <= filtroAreaMappa.TopRight.Latitudine)) &&
                            ((mezzo.Coordinate.Longitudine >= filtroAreaMappa.BottomLeft.Longitudine) && (mezzo.Coordinate.Longitudine <= filtroAreaMappa.TopRight.Longitudine))
                          )
                        {
                            ListaMezziFilter.Add(mezzo);
                        }
                    }

                    return ListaMezziFilter;
                }
            }
            catch (Exception ex)
            {
                return null;
            }
        }
    }
}
