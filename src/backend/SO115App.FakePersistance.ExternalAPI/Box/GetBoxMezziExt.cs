﻿//-----------------------------------------------------------------------
// <copyright file="GetBoxMezzi.cs" company="CNVVF">
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

using SO115App.API.Models.Classi.Boxes;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.Box;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Gac;
using SO115App.Models.Servizi.Infrastruttura.Utility;
using System;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.ExternalAPI.Fake.Box
{
    /// <summary>
    ///   La classe GetBoxMezzi recupera i mezzi utilizzabili dal servizio esterno Gac e aggiorna il
    ///   box dei mezzi
    /// </summary>
    public class GetBoxMezziExt : IGetBoxMezzi
    {
        private readonly IGetMezziUtilizzabiliPerBox _getMezziUtilizzabili;
        private readonly IGetSottoSediByCodSede _getSottoSedi;
        //private readonly IGetStatoMezzi _getStatoMezzi;

        public GetBoxMezziExt(IGetMezziUtilizzabiliPerBox getMezziUtilizzabili, IGetSottoSediByCodSede getSottoSedi/*, IGetStatoMezzi getStatoMezzi*/)
        {
            _getMezziUtilizzabili = getMezziUtilizzabili;
            _getSottoSedi = getSottoSedi;
            //_getStatoMezzi = getStatoMezzi;
        }

        /// <summary>
        ///   Il metodo accetta in firma il codice sede e recupera i mezzi utilizzabili dal servizio
        ///   esterno Gac e aggiorna i contatori dei mezzi
        /// </summary>
        /// <param name="codiceSede">il codice sede</param>
        /// <returns>BoxMezzi</returns>
        public BoxMezzi Get(string[] codiciSede)
        {
            var listaMezzi = new Dictionary<string, string>();

            var lstCodiciSede = _getSottoSedi.Get(codiciSede).Distinct().ToArray();

            try
            {
                listaMezzi = _getMezziUtilizzabili.Get(lstCodiciSede.Where(s => s.Contains('.')).ToArray()).Result;
            }
            catch (System.Exception e) 
            { 

            }

            var mezzi = new BoxMezzi()
            {
                InSede = listaMezzi?.Where(x => x.Value == Costanti.MezzoInSede || x.Value == Costanti.MezzoInUscita || x.Value == Costanti.MezzoRientrato || x.Value == Costanti.MezzoOperativoPreaccoppiato).Count() ?? 0,
                InViaggio = listaMezzi?.Where(x => x.Value == Costanti.MezzoInViaggio).Count() ?? 0,
                InRientro = listaMezzi?.Where(x => x.Value == Costanti.MezzoInRientro).Count() ?? 0,
                SulPosto = listaMezzi?.Where(x => x.Value == Costanti.MezzoSulPosto).Count() ?? 0,
                Istituto = Convert.ToInt32(listaMezzi?.Where(x => x.Key == Costanti.MezzoIstituto).First().Value)
            };

            return mezzi;
        }
    }
}
