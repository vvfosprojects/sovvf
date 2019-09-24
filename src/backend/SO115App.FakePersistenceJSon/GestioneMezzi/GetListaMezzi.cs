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
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Marker;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.Mezzi;
using SO115App.FakePersistence.JSon.Classi;
using SO115App.FakePersistence.JSon.Utility;
using SO115App.FakePersistenceJSon.GestioneIntervento;
using SO115App.Models.Classi.ListaMezziInServizio;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.GeoFleet;
using SO115App.Models.Servizi.Infrastruttura.InfoRichiesta;

namespace SO115App.FakePersistenceJSon.GestioneMezzi
{
    public class GetListaMezzi : IGetListaMezzi
    {
        private readonly IGetCoordinateFromGeoFleet _getCoordinateFromGeoFleet;
        private readonly IGetInfoRichiesta _getInfoRichiesta;

        public GetListaMezzi(IGetCoordinateFromGeoFleet getCoordinateFromGeoFleet, IGetInfoRichiesta getInfoRichiesta)
        {
            _getCoordinateFromGeoFleet = getCoordinateFromGeoFleet;
            _getInfoRichiesta = getInfoRichiesta;
        }

        public List<MezzoInServizio> Get(string codiceSede)
        {
            var listaMezzoInServizio = new List<MezzoInServizio>();
            var filepathFlotta = CostantiJson.FlottaMezzi;
            var filepathMezzo = CostantiJson.Mezzo;
            var getRichiestaById = new GetRichiestaById();
            string jsonFlotta;
            string jsonMezzo;
            using (var r = new StreamReader(filepathFlotta))
            {
                jsonFlotta = r.ReadToEnd();
            }
            using (var r = new StreamReader(filepathMezzo))
            {
                jsonMezzo = r.ReadToEnd();
            }

            var codiceSedeIniziali = codiceSede.Substring(0, 2);

            var flottaMezzi = JsonConvert.DeserializeObject<List<MezziFromGeoFleet>>(jsonFlotta);
            var mezzi = JsonConvert.DeserializeObject<List<Mezzo>>(jsonMezzo).FindAll(x => x.Stato != Costanti.MezzoFuoriServizio && x.Stato != Costanti.MezzoStatoSconosciuto);

            foreach (var mezzo in mezzi
                .FindAll(x => x.Distaccamento.Codice
                .StartsWith(codiceSedeIniziali)))
            {
                foreach (var mezziFromGeoFleet in flottaMezzi.Where(mezziFromGeoFleet => mezzo.Codice.Equals(mezziFromGeoFleet.CodiceMezzo)))
                {
                    mezzo.Coordinate = _getCoordinateFromGeoFleet.CodificaLocalizzazione(mezziFromGeoFleet.Localizzazione);
                    mezzo.IstanteAcquisizione = mezziFromGeoFleet.IstanteAcquisizione;
                }

                var mezzoMarker = new MezzoMarker()
                {
                    Mezzo = mezzo,
                    InfoRichiesta = _getInfoRichiesta.GetInfoRichiestaFromIdRichiestaMezzo(mezzo.IdRichiesta)
                };
                var mezzoInServizio = new MezzoInServizio()
                {
                    Mezzo = mezzoMarker
                };

                if (mezzo.IdRichiesta != null)
                {
                    var richiesta = getRichiestaById.Get(mezzo.IdRichiesta);
                    if (richiesta != null)
                    {
                        foreach (var partenza in richiesta.Partenze)
                        {
                            if (partenza.Partenza.Mezzo.Codice == mezzo.Codice)
                            {
                                mezzoInServizio.Squadre = partenza.Partenza.Squadre;
                            }
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
