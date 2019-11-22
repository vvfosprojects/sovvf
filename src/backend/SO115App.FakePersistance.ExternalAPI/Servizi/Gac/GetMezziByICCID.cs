//-----------------------------------------------------------------------
// <copyright file="GetMezziByICCID.cs" company="CNVVF">
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
    ///   Servizio fake che recupera una lista di mezzi dal GAC a partire dal loro codice iccid (SIMCARD)
    /// </summary>
    public class GetMezziByICCID : IGetMezziByICCID
    {
        private readonly GetMezzi _getMezzi;
        private readonly MapMezzoDTOsuMezzo _mapper;

        /// <summary>
        ///   costruttore della classe
        /// </summary>
        /// <param name="mapper">injection del mapper Mezzo-MezzoDTO</param>
        /// <param name="getMezzi">mock del servizio Gac</param>
        public GetMezziByICCID(MapMezzoDTOsuMezzo mapper, GetMezzi getMezzi)
        {
            _mapper = mapper;
            _getMezzi = getMezzi;
        }

        /// <summary>
        ///   Restituisce la lista fake dei mezzi
        /// </summary>
        /// <param name="iccid">una lista di codici iccid</param>
        /// <returns>una lista mezzi</returns>
        public List<Mezzo> Get(List<string> iccid)
        {
            //---------------TODO Implementazione con il servizio esterno reale che sostituirà i json

            var listaMezzoDTO = _getMezzi.GetMezziFromICCID(iccid); //json

            //---------------------------------------------------------------------------------------
            return _mapper.MappaMezzoDTOsuMezzo(listaMezzoDTO);
        }
    }
}
