//-----------------------------------------------------------------------
// <copyright file="GetListaEventi.cs" company="CNVVF">
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
using SO115App.API.Models.Classi.ListaEventi;
using SO115App.API.Models.Servizi.CQRS.Queries.ListaEventi;
using SO115App.Models.Classi.ListaEventi;
using SO115App.Models.Servizi.Infrastruttura.GetListaEventi;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace SO115App.FakePersistenceJSon.ListaEventi
{
    public class GetListaEventi : IGetListaEventi
    {
        public List<Eventi> Get(ListaEventiQuery query)
        {
            List<Eventi> eventi = new List<Eventi>();
            string filepath = "Fake/ListaRichiesteAssistenza.json";
            string json;
            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            List<RichiesteAssistenza> richieste = JsonConvert.DeserializeObject<List<RichiesteAssistenza>>(json);
            richieste = richieste.Where(x => x.Id == query.Id).ToList();
            eventi = richieste.Select(x => x.Eventi).FirstOrDefault();

            return eventi;
        }
    }
}
