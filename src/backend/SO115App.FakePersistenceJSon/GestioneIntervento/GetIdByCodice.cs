//-----------------------------------------------------------------------
// <copyright file="GetIdByCodice.cs" company="CNVVF">
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
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace SO115App.FakePersistenceJSon.GestioneIntervento
{
    public class GetIdByCodice : IGetIdByCodice
    {
        public string Get(string codice)
        {
            string IdRichiesta;

            string filepath = "Fake/ListaRichiesteAssistenza.json";
            string json;
            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            List<RichiestaAssistenzaRead> ListaRichieste = JsonConvert.DeserializeObject<List<RichiestaAssistenzaRead>>(json);

            if (ListaRichieste != null)
                IdRichiesta = ((RichiestaAssistenzaRead)ListaRichieste.FirstOrDefault(ric => ric.Codice == codice)).Id;
            else
                IdRichiesta = "";

            return IdRichiesta;
        }
    }
}
