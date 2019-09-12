//-----------------------------------------------------------------------
// <copyright file="GetBoxMezzi.cs" company="CNVVF">
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
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Boxes;
using SO115App.API.Models.Classi.Marker;
using SO115App.FakePersistence.JSon.Classi;
using SO115App.FakePersistence.JSon.Utility;
using SO115App.Models.Servizi.Infrastruttura.Box;

namespace SO115App.FakePersistenceJSon.Box
{
    public class GetBoxMezzi : IGetBoxMezzi
    {
        public BoxMezzi Get(string CodiceSede)
        {
            MapFromFlottaToMezziMarker mapper = new MapFromFlottaToMezziMarker();
            var mezzi = new BoxMezzi();
            List<MezzoMarker> ListaMezzi = new List<MezzoMarker>();

            string filepath = CostantiJson.FlottaMezzi;
            string json;
            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            List<MapperMezziFromGeoFleet> FlottaMezzi = JsonConvert.DeserializeObject<List<MapperMezziFromGeoFleet>>(json);
            ListaMezzi = mapper.MappaFlottaMezziSuMezziMarker(FlottaMezzi).Where(x => x.Mezzo.Distaccamento.Codice == CodiceSede).ToList();

            mezzi.InSede = ListaMezzi.Where(x => x.Mezzo.Stato == "InSede")
                .Select(x => x.Mezzo.Stato)
                .Count();
            mezzi.InViaggio = ListaMezzi.Where(x => x.Mezzo.Stato == "InViaggio")
                .Select(x => x.Mezzo.Stato)
                .Count();
            mezzi.InRientro = ListaMezzi.Where(x => x.Mezzo.Stato == "InRientro")
                .Select(x => x.Mezzo.Stato)
                .Count();
            mezzi.SulPosto = ListaMezzi.Where(x => x.Mezzo.Stato == "SulPosto")
                .Select(x => x.Mezzo.Stato)
                .Count();
            mezzi.Istituto = ListaMezzi.Where(x => x.Mezzo.Stato == "Istituto")
                .Select(x => x.Mezzo.Stato)
                .Count();
            mezzi.InServizio = mezzi.InSede + mezzi.InRientro + mezzi.SulPosto + mezzi.Istituto + mezzi.InViaggio;

            return mezzi;
        }
    }
}
