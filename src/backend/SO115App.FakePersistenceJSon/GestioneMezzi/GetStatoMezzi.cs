//-----------------------------------------------------------------------
// <copyright file="GetStatoMezzi.cs" company="CNVVF">
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
using SO115App.FakePersistence.JSon.Utility;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using System.Collections.Generic;
using System.IO;

namespace SO115App.FakePersistence.JSon.GestioneMezzi
{
    /// <summary>
    ///   La classe recupera sul json i mezzi prenotati qualora ci fossero
    /// </summary>
    public class GetStatoMezzi : IGetStatoMezzi
    {
        /// <summary>
        ///   Metodo della classe che si occupa del reperimento dei mezzi prenotati sul Json.
        /// </summary>
        /// <param name="codiceSede">il codice della sede</param>
        /// <returns>Lista di MezzoPrenotato</returns>

        public List<StatoOperativoMezzo> Get(string codiceSede, string codiceMezzo = null)
        {
            var filepath = CostantiJson.StatoMezzo;
            string json;
            using (var r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }
            return JsonConvert.DeserializeObject<List<StatoOperativoMezzo>>(json).FindAll(x => x.CodiceSede.Equals(codiceSede));
        }
    }
}
