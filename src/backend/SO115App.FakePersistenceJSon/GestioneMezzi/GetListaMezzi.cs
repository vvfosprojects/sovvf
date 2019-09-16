//-----------------------------------------------------------------------
// <copyright file="GetComposizioneMezzi.cs" company="CNVVF">
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
using SO115App.API.Models.Classi.Composizione;
using SO115App.API.Models.Classi.Marker;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.Mezzi;
using SO115App.FakePersistence.JSon.Classi;
using SO115App.FakePersistence.JSon.Utility;
using SO115App.FakePersistenceJSon.GestioneIntervento;
using SO115App.Models.Classi.ListaMezziInServizio;

namespace SO115App.FakePersistenceJSon.GestioneMezzi
{
    public class GetListaMezzi : IGetListaMezzi
    {
        public List<MezzoInServizio> Get(string codiceSede)
        {
            var mapper = new MapFromFlottaToMezziMarker();
            var filepath = CostantiJson.FlottaMezzi;
            var getRichiestaById = new GetRichiestaById();
            string json;
            using (var r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            var flottaMezzi = JsonConvert.DeserializeObject<List<MapperMezziFromGeoFleet>>(json);
            var listaMezziMarker = mapper.MappaFlottaMezziSuMezziMarker(flottaMezzi).FindAll(x => x.Mezzo.Distaccamento.Codice.Equals(codiceSede));
            
            var listaMezzoInServizio = new List<MezzoInServizio>();

            foreach (var mezzoMarkerIn in listaMezziMarker)
            {
                var mezzoInServizio = new MezzoInServizio {Mezzo = mezzoMarkerIn};
                if (mezzoInServizio.Mezzo.Mezzo.IdRichiesta != null)
                {
                    var richiesta = getRichiestaById.Get(mezzoInServizio.Mezzo.Mezzo.IdRichiesta);
                    foreach (var partenza in richiesta.Partenze)
                    {
                        if (partenza.Partenza.Mezzo.Codice == mezzoInServizio.Mezzo.Mezzo.Codice)
                        {
                            mezzoInServizio.Squadre = partenza.Partenza.Squadre;
                        }
                    }
                }
                else
                {
                    mezzoInServizio.Squadre = null;
                }

                listaMezzoInServizio.Add(mezzoInServizio);
            }

            return listaMezzoInServizio;
        }
    }
}
