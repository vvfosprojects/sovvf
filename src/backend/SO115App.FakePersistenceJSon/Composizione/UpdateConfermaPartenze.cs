//-----------------------------------------------------------------------
// <copyright file="UpDateRichiesta.cs" company="CNVVF">
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
using DomainModel.CQRS.Commands.ConfermaPartenze;
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Composizione;
using SO115App.API.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.Composizione;

namespace SO115App.FakePersistenceJSon.Composizione
{
    public class UpdateConfermaPartenze : IUpdateConfermaPartenze
    {
        public ConfermaPartenze Update(ConfermaPartenzeCommand command)
        {
            string filepath = "Fake/ListaRichiesteAssistenza.json";
            string json;
            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }
            SintesiRichieste richiesta = new SintesiRichieste();
            ConfermaPartenze conferma = new ConfermaPartenze();
            List<SintesiRichieste> ListaRichieste = JsonConvert.DeserializeObject<List<SintesiRichieste>>(json);
                richiesta = ListaRichieste.Where(x => x.Codice == command.ConfermaPartenze.IdRichiesta).FirstOrDefault();
                ListaRichieste.Remove(richiesta);
                richiesta.Partenze = command.ConfermaPartenze.Partenze;
                ListaRichieste.Add(richiesta);
                string fileText = System.IO.File.ReadAllText(@"Fake/ListaRichiesteAssistenza.json");
                string jsonNew = JsonConvert.SerializeObject(ListaRichieste);
                System.IO.File.WriteAllText(@"Fake/ListaRichiesteAssistenza.json", jsonNew);
                conferma.CodiceSede = command.codiceSede;
                conferma.IdRichiesta = command.ConfermaPartenze.IdRichiesta;
                conferma.Chiamata = richiesta;
                return conferma;
        }
    }
}

