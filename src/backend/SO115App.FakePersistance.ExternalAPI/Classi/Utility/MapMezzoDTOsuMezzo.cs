//-----------------------------------------------------------------------
// <copyright file="MapMezzoDTOsuMezzo.cs" company="CNVVF">
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
using SO115App.ExternalAPI.Fake.Classi.Gac;
using SO115App.Models.Servizi.Infrastruttura.GeoFleet;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.IdentityManagement;
using System.Collections.Generic;

namespace SO115App.ExternalAPI.Fake.Classi.Utility
{
    /// <summary>
    ///   Servizio che mappa la classe DTO derivante dal servizio GAC nella classe mezzo.cs di SO,
    ///   inoltre recupera le coordinate del mezzo dal servizio geofleet.
    /// </summary>
    public class MapMezzoDTOsuMezzo
    {
        private readonly IGetPosizioneByCodiceMezzo _getPosizioneByCodiceMezzo;
        private readonly IGetDistaccamentoByCodiceSede _getDistaccamentoByCodiceSede;

        public MapMezzoDTOsuMezzo(IGetPosizioneByCodiceMezzo getPosizioneByCodiceMezzo, IGetDistaccamentoByCodiceSede getDistaccamentoByCodiceSede)
        {
            _getPosizioneByCodiceMezzo = getPosizioneByCodiceMezzo;
            _getDistaccamentoByCodiceSede = getDistaccamentoByCodiceSede;
        }

        /// <summary>
        ///   Il metodo della classe che mappa MezzoDTO integrando le coordinate da GeoFleet.
        /// </summary>
        /// <param name="listaMezzoDTO">Il DTO che arriva da GAC</param>
        /// <returns>Una lista di Mezzo</returns>
        public List<Mezzo> MappaMezzoDTOsuMezzo(List<MezzoDTO> listaMezzoDTO)
        {
            var listaMezzi = new List<Mezzo>();

            foreach (var mezzoDTO in listaMezzoDTO)
            {
                if (mezzoDTO.Movimentazione.StatoOperativo.Equals(Costanti.MezzoDisponibile)) mezzoDTO.Movimentazione.StatoOperativo = Costanti.MezzoInSede;
                var coordinateMezzo = _getPosizioneByCodiceMezzo.Get(mezzoDTO.CodiceMezzo).Result;
                var sede = _getDistaccamentoByCodiceSede.Get(mezzoDTO.CodiceDistaccamento);
                if (coordinateMezzo != null)
                {
                    var coordinate = new Coordinate(coordinateMezzo.Localizzazione.Lat, coordinateMezzo.Localizzazione.Lon);
                    var mezzo = new Mezzo(mezzoDTO.CodiceMezzo, mezzoDTO.Descrizione, mezzoDTO.Genere, mezzoDTO.Movimentazione.StatoOperativo, mezzoDTO.Appartenenza, sede, coordinate)
                    {
                        StatoEfficenza = mezzoDTO.StatoEfficenza,
                        IstanteAcquisizione = coordinateMezzo.IstanteAcquisizione
                    };
                    if (!string.IsNullOrEmpty(mezzoDTO.Movimentazione.IdRichiesta)) mezzo.IdRichiesta = mezzoDTO.Movimentazione.IdRichiesta;
                    listaMezzi.Add(mezzo);
                }
                else
                {
                    var coordinate = new Coordinate(sede.Coordinate.Latitudine, sede.Coordinate.Longitudine);
                    var mezzo = new Mezzo(mezzoDTO.CodiceMezzo, mezzoDTO.Descrizione, mezzoDTO.Genere, mezzoDTO.Movimentazione.StatoOperativo, mezzoDTO.Appartenenza, sede, coordinate)
                    {
                        StatoEfficenza = mezzoDTO.StatoEfficenza,
                        IstanteAcquisizione = null
                    };
                    if (!string.IsNullOrEmpty(mezzoDTO.Movimentazione.IdRichiesta)) mezzo.IdRichiesta = mezzoDTO.Movimentazione.IdRichiesta;
                    listaMezzi.Add(mezzo);
                }
            }
            return listaMezzi;
        }
    }
}
