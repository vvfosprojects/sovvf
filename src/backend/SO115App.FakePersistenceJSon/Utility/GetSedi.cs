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
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Geo;
using SO115App.FakePersistence.JSon.Utility;
using System.Collections.Generic;
using System.IO;

namespace SO115App.FakePersistenceJSon.Utility
{
    public class GetSedi
    {
        public List<Sede> GetListaSedi(AreaMappa filtroAreaMappa)
        {
            List<Sede> ListaSedi = new List<Sede>();
            string filepath = CostantiJson.MarkerSedi;
            string json;
            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            List<Sede> ListaSediMarker = JsonConvert.DeserializeObject<List<Sede>>(json);

            if (filtroAreaMappa == null)
                return ListaSedi = ListaSediMarker;
            else
            {
                foreach (Sede sede in ListaSediMarker)
                {
                    if (((sede.Coordinate.Latitudine >= filtroAreaMappa.BottomLeft.Latitudine) && (sede.Coordinate.Latitudine <= filtroAreaMappa.TopRight.Latitudine)) &&
                        ((sede.Coordinate.Longitudine >= filtroAreaMappa.BottomLeft.Longitudine) && (sede.Coordinate.Longitudine <= filtroAreaMappa.TopRight.Longitudine))
                      )
                    {
                        ListaSedi.Add(sede);
                    }
                }

                return ListaSedi;
            }
        }

        public Sede GetSedeByCodiceSede(string codiceSede)
        {
            var filepath = CostantiJson.MarkerSedi;
            string json;
            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            var listaSediMarker = JsonConvert.DeserializeObject<List<Sede>>(json);

            return listaSediMarker.Find(x => x.Codice.Equals(codiceSede));
        }
    }
}
