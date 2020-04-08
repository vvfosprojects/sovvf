//-----------------------------------------------------------------------
// <copyright file="GetMezziByID.cs" company="CNVVF">
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
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.Servizi.Gac
{
    /// <summary>
    ///   Servizio fake che recupera una lista di mezzi dal GAC a partire dal loro codice mezzo.
    /// </summary>
    public class GetMezziByCodiceMezzo : IGetMezziByCodiceMezzo
    {
        private readonly MapMezzoDTOsuMezzo _mapper;
        private readonly GetMezzi _getMezzi;

        /// <summary>
        ///   costruttore della classe
        /// </summary>
        /// <param name="mapper">injection del mapper Mezzo-MezzoDTO</param>
        /// <param name="getMezzi">mock del servizio Gac</param>
        public GetMezziByCodiceMezzo(MapMezzoDTOsuMezzo mapper, GetMezzi getMezzi)
        {
            _mapper = mapper;
            _getMezzi = getMezzi;
        }

        /// <summary>
        ///   Restituisce la lista fake dei mezzi dal json
        /// </summary>
        /// <param name="codiceMezzo">una lista di codici mezzo</param>
        /// <returns>una lista mezzi</returns>
        //public Task<List<Mezzo>> Get(List<string> codiceMezzo, string codSede)
        //{
        //    //---------------TODO Implementazione con il servizio esterno reale che sostituirà i json

        // var listaMezzoDTO = _getMezzi.GetMezziFromCodiceMezzo(codiceMezzo); //json

        //    //---------------------------------------------------------------------------------------
        //    return  _mapper.MappaMezzoDTOsuMezzo(listaMezzoDTO);
        //}

        Task<List<Mezzo>> IGetMezziByCodiceMezzo.Get(List<string> codiceMezzo, string codSede)
        {
            throw new System.NotImplementedException();
        }
    }
}
