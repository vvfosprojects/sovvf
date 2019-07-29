//-----------------------------------------------------------------------
// <copyright file="GetComposizioneMezzi.cs" company="CNVVF">
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
using System.IO;
using System.Linq;
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Composizione;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneMezziInServizio.ListaMezziInSerivizio;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.Mezzi;
using SO115App.FakePersistence.JSon.Utility;

namespace SO115App.FakePersistenceJSon.GestioneMezzi
{
    public class GetListaMezzi : IGetListaMezzi
    {
        public List<Mezzo> Get(string codiceSede)
        {
            var filepath = CostantiJson.MezziComposizione;
            string json;
            using (var r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            var composizioneMezzi = JsonConvert.DeserializeObject<List<ComposizioneMezzi>>(json);

            var listaMezzi = new List<Mezzo>();

            foreach (var composizione in composizioneMezzi.Where(x => x.Mezzo.Distaccamento.Codice == codiceSede).ToList())
            {
                listaMezzi.Add(composizione.Mezzo);
            }

            return listaMezzi;
        }
    }
}
