//-----------------------------------------------------------------------
// <copyright file="GetDistaccamentoByCodiceSede.cs" company="CNVVF">
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
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Condivise;
using SO115App.FakePersistence.JSon.Utility;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.IdentityManagement;
using System.Collections.Generic;
using System.IO;

namespace SO115App.FakePersistence.JSon.Distaccamenti
{
    /// <summary>
    ///   Classe che legge su un Json fake per il reperimento di un distaccamento.
    /// </summary>
    public class GetDistaccamentoByCodiceSede : IGetDistaccamentoByCodiceSede
    {
        /// <summary>
        ///   Metodo della classe che reperisce il distaccamento se c'è, altrimenti invia il
        ///   distaccamento con codice sede RM.1000
        /// </summary>
        /// <param name="codiceSede"></param>
        /// <returns>Sede</returns>
        public Sede Get(string codiceSede)
        {
            var filepath = CostantiJson.Distaccamenti;
            string json;
            using (var r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            };

            var listaSedi = JsonConvert.DeserializeObject<List<Sede>>(json);
            var sede = listaSedi.Find(x => x.Codice.Equals(codiceSede));
            return sede ?? listaSedi.Find(x => x.Codice.Equals("RM.1000"));
        }
    }
}
