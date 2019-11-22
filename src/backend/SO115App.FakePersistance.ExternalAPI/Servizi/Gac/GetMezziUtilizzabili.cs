//-----------------------------------------------------------------------
// <copyright file="GetMezziUtilizzabili.cs" company="CNVVF">
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
using SO115App.ExternalAPI.Fake.Classi.Utility;
using SO115App.ExternalAPI.Fake.Servizi.Gac.Mock;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Gac;
using System.Collections.Generic;

namespace SO115App.ExternalAPI.Fake.Servizi.Gac
{
    /// <summary>
    ///   Servizio che recupera da GAC fake una lista di mezzi in servizio.
    /// </summary>
    public class GetMezziUtilizzabili : IGetMezziUtilizzabili
    {
        private readonly MapMezzoDTOsuMezzo _mapper;
        private readonly GetMezzi _getMezzi;

        /// <summary>
        ///   costruttore della classe
        /// </summary>
        /// <param name="mapper">injection del mapper Mezzo-MezzoDTO</param>
        /// <param name="getMezzi">mock del servizio Gac</param>
        public GetMezziUtilizzabili(MapMezzoDTOsuMezzo mapper, GetMezzi getMezzi)
        {
            _mapper = mapper;
            _getMezzi = getMezzi;
        }

        /// <summary>
        ///   Restituisce la lista dei mezzi fake
        /// </summary>
        /// <param name="sedi">una lista di codici sede</param>
        /// <param name="genereMezzo">il genere del mezzo (opzionale)</param>
        /// <param name="siglaMezzo">la sigla del mezzo (opzionale)</param>
        /// <returns>una lista mezzi</returns>
        public List<Mezzo> Get(List<string> sedi, string genereMezzo, string siglaMezzo)
        {
            //---------------TODO Implementazione con il servizio esterno reale che sostituirà i json

            var listaMezzoDTO = _getMezzi.GetMezziUtilizzabili(sedi, genereMezzo, siglaMezzo); //json

            //---------------------------------------------------------------------------------------

            return _mapper.MappaMezzoDTOsuMezzo(listaMezzoDTO);
        }
    }
}
