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
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Geo;
using SO115App.API.Models.Classi.Marker;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.InfoRichiesta;
using SO115App.Models.Servizi.Infrastruttura.Marker;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Gac;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.ExternalAPI.Fake.Marker
{
    /// <summary>
    ///   la classe recupera le informazioni dei mezzi che sono circoscritti in una determinata area mappa
    /// </summary>
    public class GetMezziMarkerExt : IGetMezziMarker
    {
        private readonly IGetInfoRichiesta _getInfoRichiesta;
        private readonly IGetMezziUtilizzabili _getMezziUtilizzabili;

        public GetMezziMarkerExt(IGetInfoRichiesta getInfoRichiesta, IGetMezziUtilizzabili getMezziUtilizzabili)
        {
            _getInfoRichiesta = getInfoRichiesta;
            _getMezziUtilizzabili = getMezziUtilizzabili;
        }

        /// <summary>
        ///   il metodo la classe recupera le informazioni dei mezzi e la loro posizione georeferenziata.
        /// </summary>
        /// <param name="filtroAreaMappa">un area mappa</param>
        /// <returns>Lista di MezziMarker</returns>
        public List<MezzoMarker> GetListaMezziMarker(AreaMappa filtroAreaMappa)
        {
            var listaMezziFilter = new List<MezzoMarker>();

            var listaMezzi = _getMezziUtilizzabili.Get(filtroAreaMappa.CodiceSede).Result;

            var listaMezziMarker = new List<MezzoMarker>();

            foreach (var mezzo in listaMezzi)
            {
                var mezzoMarker = new MezzoMarker()
                {
                    Mezzo = mezzo,
                    InfoRichiesta = _getInfoRichiesta.GetInfoRichiestaFromIdRichiestaMezzo(mezzo.IdRichiesta)
                };
                listaMezziMarker.Add(mezzoMarker);
            }

            if (filtroAreaMappa.BottomLeft == null) return listaMezziMarker;

            listaMezziFilter.AddRange(listaMezziMarker.Where(mezzo => mezzo.Mezzo.Coordinate.Latitudine >= filtroAreaMappa.BottomLeft.Latitudine && mezzo.Mezzo.Coordinate.Latitudine <= filtroAreaMappa.TopRight.Latitudine && mezzo.Mezzo.Coordinate.Longitudine >= filtroAreaMappa.BottomLeft.Longitudine && mezzo.Mezzo.Coordinate.Longitudine <= filtroAreaMappa.TopRight.Longitudine));

            var listaMezziMarkerRaggruppata = new List<MezzoMarker>();

            var listaMezziFiltrataPerStato = new List<MezzoMarker>();
            var listaMezziFitrataPerStatoEGenere = new List<MezzoMarker>();
            var listaMezziFiltrataPerGenere = new List<MezzoMarker>();

            if (filtroAreaMappa.FiltroMezzi.Stato.Any())
            {
                foreach (var stato in filtroAreaMappa.FiltroMezzi.Stato)
                {
                    listaMezziFiltrataPerStato.AddRange(listaMezziFilter.FindAll(x => x.Mezzo.Stato.Equals(stato)));
                }

                if (!filtroAreaMappa.FiltroMezzi.Tipologia.Any())
                {
                    listaMezziFilter = listaMezziFiltrataPerStato;
                }
            }
            if (filtroAreaMappa.FiltroMezzi.Tipologia.Any())
            {
                foreach (var genere in filtroAreaMappa.FiltroMezzi.Tipologia)
                {
                    listaMezziFiltrataPerGenere.AddRange(listaMezziFilter.FindAll(x => x.Mezzo.Genere.Equals(genere)));
                }
                if (!filtroAreaMappa.FiltroMezzi.Stato.Any())
                {
                    listaMezziFilter = listaMezziFiltrataPerGenere;
                }
            }

            if (filtroAreaMappa.FiltroMezzi.Tipologia.Any() && filtroAreaMappa.FiltroMezzi.Stato.Any())
            {
                listaMezziFilter = listaMezziFiltrataPerStato.FindAll(x => listaMezziFiltrataPerGenere.Contains(x));
            }

            return listaMezziFilter;
            //return GroupListaMezziMarker.Group(listaMezziFilter); //TODO da integrare con la clusterizzazione.
        }
    }
}
