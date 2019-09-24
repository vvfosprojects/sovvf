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
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Geo;
using SO115App.API.Models.Classi.Marker;
using SO115App.FakePersistence.JSon.Classi;
using SO115App.FakePersistence.JSon.Utility;
using SO115App.Models.Servizi.Infrastruttura.GeoFleet;
using SO115App.Models.Servizi.Infrastruttura.InfoRichiesta;
using SO115App.Models.Servizi.Infrastruttura.Marker;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace SO115App.FakePersistenceJSon.Marker
{
    public class GetMezziMarker : IGetMezziMarker
    {
        private readonly IGetCoordinateFromGeoFleet _getCoordinateFromGeoFleet;
        private readonly IGetInfoRichiesta _getInfoRichiesta;

        public GetMezziMarker(IGetCoordinateFromGeoFleet getCoordinateFromGeoFleet, IGetInfoRichiesta getInfoRichiesta)
        {
            _getCoordinateFromGeoFleet = getCoordinateFromGeoFleet;
            _getInfoRichiesta = getInfoRichiesta;
        }

        public List<MezzoMarker> GetListaMezziMarker(AreaMappa filtroAreaMappa)
        {
            var listaMezziFilter = new List<MezzoMarker>();

            var filepath = CostantiJson.Mezzo;
            string json;
            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }
            var filepathFlotta = CostantiJson.FlottaMezzi;
            string jsonFlotta;
            using (StreamReader r = new StreamReader(filepathFlotta))
            {
                jsonFlotta = r.ReadToEnd();
            }

            try
            {
                var flottaMezzi = JsonConvert.DeserializeObject<List<MezziFromGeoFleet>>(jsonFlotta);
                var listaMezzi = JsonConvert.DeserializeObject<List<Mezzo>>(json);
                var listaMezziMarker = new List<MezzoMarker>();

                foreach (var mezzo in listaMezzi)
                {
                    foreach (var mezziFromGeoFleet in flottaMezzi.Where(mezziFromGeoFleet => mezzo.Codice.Equals(mezziFromGeoFleet.CodiceMezzo)))
                    {
                        mezzo.Coordinate = _getCoordinateFromGeoFleet.CodificaLocalizzazione(mezziFromGeoFleet.Localizzazione);
                    }
                    var mezzoMarker = new MezzoMarker()
                    {
                        Mezzo = mezzo,
                        InfoRichiesta = _getInfoRichiesta.GetInfoRichiestaFromIdRichiestaMezzo(mezzo.IdRichiesta)
                    };

                    listaMezziMarker.Add(mezzoMarker);
                }

                if (filtroAreaMappa == null) return listaMezziMarker;

                listaMezziFilter.AddRange(listaMezziMarker.Where(mezzo => (mezzo.Mezzo.Coordinate.Latitudine >= filtroAreaMappa.BottomLeft.Latitudine) && (mezzo.Mezzo.Coordinate.Latitudine <= filtroAreaMappa.TopRight.Latitudine) && ((mezzo.Mezzo.Coordinate.Longitudine >= filtroAreaMappa.BottomLeft.Longitudine) && (mezzo.Mezzo.Coordinate.Longitudine <= filtroAreaMappa.TopRight.Longitudine))));

                return listaMezziFilter;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
    }
}
