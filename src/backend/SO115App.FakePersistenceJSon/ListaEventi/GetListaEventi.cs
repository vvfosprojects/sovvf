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
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Classi.Soccorso.Eventi;
using SO115App.API.Models.Servizi.CQRS.Queries.ListaEventi;
using SO115App.FakePersistenceJSon.Classi;
using SO115App.FakePersistenceJSon.Utility;
using SO115App.Models.Classi.ListaEventi;
using SO115App.Models.Servizi.Infrastruttura.GetListaEventi;

namespace SO115App.FakePersistenceJSon.ListaEventi
{
    public class GetListaEventi : IGetListaEventi
    {
        public List<Evento> Get(ListaEventiQuery query)
        {
            List<Evento> eventi = new List<Evento>();
            string filepath = "Fake/ListaRichiesteAssistenza.json";
            string json;
            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            List<RichiestaAssistenza> ListaRichieste = new List<RichiestaAssistenza>();
            List<RichiestaAssistenzaDTO> richieste = JsonConvert.DeserializeObject<List<RichiestaAssistenzaDTO>>(json);
            var richiestaAss = new RichiestaAssistenza();

            foreach (RichiestaAssistenzaDTO richiesta in richieste)
            {
                if (richiesta.Id == query.Id)
                    richiestaAss = MapperDTO.MapRichiestaDTOtoRichiesta(richiesta);
            }

            eventi = richiestaAss.Eventi.ToList();

            return eventi;
        }
    }
}
