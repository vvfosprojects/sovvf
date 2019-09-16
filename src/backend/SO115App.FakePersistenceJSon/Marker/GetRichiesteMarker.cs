//-----------------------------------------------------------------------
// <copyright file="GetRichiesteMarker.cs" company="CNVVF">
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
using System.Diagnostics;
using System.IO;
using System.Linq;
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Geo;
using SO115App.API.Models.Classi.Marker;
using SO115App.FakePersistence.JSon.Utility;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.Marker;

namespace SO115App.FakePersistenceJSon.Marker
{
    public class GetRichiesteMarker : IGetRichiesteMarker
    {
        public List<SintesiRichiestaMarker> GetListaRichiesteMarker(AreaMappa filtroAreaMappa)
        {
            var filepath = CostantiJson.ListaRichiesteAssistenza;
            string json;

            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            var listaSintesiRichiesteMarker = JsonConvert.DeserializeObject<List<SintesiRichiestaMarker>>(json);
            List<SintesiRichiestaMarker> listaSintesiRichiestaMarkers;

            if (listaSintesiRichiesteMarker == null) return null;
            switch (filtroAreaMappa)
            {
                case null:
                    return listaSintesiRichiesteMarker;

                default:
                    listaSintesiRichiestaMarkers = listaSintesiRichiesteMarker.Where(richiesta =>
                            (richiesta.Localita.Coordinate.Latitudine >= filtroAreaMappa.BottomLeft.Latitudine)
                            && (richiesta.Localita.Coordinate.Latitudine <= filtroAreaMappa.TopRight.Latitudine)
                            && (richiesta.Localita.Coordinate.Longitudine >= filtroAreaMappa.BottomLeft.Longitudine)
                            && (richiesta.Localita.Coordinate.Longitudine <= filtroAreaMappa.TopRight.Longitudine))
                        .ToList();
                    break;
            }

            if (filtroAreaMappa.FiltroRichieste == null) return listaSintesiRichiestaMarkers;
            var listaRichiesteFiltrate = new List<SintesiRichiestaMarker>();

            if (!filtroAreaMappa.FiltroRichieste.Stato.Any()) return filtroAreaMappa.FiltroRichieste.Priorita == null ? listaSintesiRichiestaMarkers : listaSintesiRichiestaMarkers.FindAll(x => x.PrioritaRichiesta >= filtroAreaMappa.FiltroRichieste.Priorita); ;

            foreach (var statoRichiesta in filtroAreaMappa.FiltroRichieste.Stato)
            {
                if (statoRichiesta == Costanti.RichiestaAssegnata)
                {
                    listaRichiesteFiltrate.AddRange(
                        listaSintesiRichiesteMarker.FindAll(x => x.Stato == Costanti.RichiestaAssegnata));
                }
                if (statoRichiesta == Costanti.RichiestaPresidiata)
                {
                    listaRichiesteFiltrate.AddRange(
                        listaSintesiRichiesteMarker.FindAll(x => x.Stato == Costanti.RichiestaPresidiata));
                }
                if (statoRichiesta == Costanti.Chiamata)
                {
                    listaRichiesteFiltrate.AddRange(
                        listaSintesiRichiesteMarker.FindAll(x => x.Stato == Costanti.Chiamata));
                }
                if (statoRichiesta == Costanti.RichiestaSospesa)
                {
                    listaRichiesteFiltrate.AddRange(
                        listaSintesiRichiesteMarker.FindAll(x => x.Stato == Costanti.RichiestaSospesa));
                }
            }
            return filtroAreaMappa.FiltroRichieste.Priorita == null ? listaRichiesteFiltrate : listaRichiesteFiltrate.FindAll(x => x.PrioritaRichiesta >= filtroAreaMappa.FiltroRichieste.Priorita);
        }
    }
}
