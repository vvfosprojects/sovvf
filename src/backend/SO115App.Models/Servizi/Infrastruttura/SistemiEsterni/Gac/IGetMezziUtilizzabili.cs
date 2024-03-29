﻿//-----------------------------------------------------------------------
// <copyright file="IGetMezziUtilizzabili.cs" company="CNVVF">
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
using SO115App.Models.Classi.ServiziEsterni;
using SO115App.Models.Classi.ServiziEsterni.Gac;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Gac
{
    /// <summary>
    ///   Servizio che recupera da GAC una lista di mezzi in servizio.
    /// </summary>
    public interface IGetMezziUtilizzabili
    {
        /// <summary>
        ///   Restituisce la lista dei mezzi
        /// </summary>
        /// <param name="sedi">una lista di codici sede</param>
        /// <param name="genereMezzo">il genere del mezzo (opzionale)</param>
        /// <param name="codiceMezzo">la sigla del mezzo (opzionale)</param>
        /// <returns>una lista mezzi</returns>
        Task<List<Mezzo>> Get(List<string> sedi, string genereMezzo = null, string codiceMezzo = null, List<MessaggioPosizione> posizioneFlotta = null);

        Task<List<MezzoDTO>> GetInfo(List<string> codiciMezzo);

        Task<List<Mezzo>> GetBySedi(string[] sedi);
    }
}
