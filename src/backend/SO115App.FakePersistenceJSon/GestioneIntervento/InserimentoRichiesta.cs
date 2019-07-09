//-----------------------------------------------------------------------
// <copyright file="InserimentoRichiesta.cs" company="CNVVF">
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
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;

namespace SO115App.FakePersistenceJSon.GestioneIntervento
{
    public class InserimentoRichiesta : ISaveRichiestaAssistenza
    {
        public void Save(RichiestaAssistenza richiestaAssistenza)
        {
            string filepath = "Fake/ListaRichiesteAssistenza.json";
            string json;
            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            List<RichiestaAssistenzaRead> ListaRichieste = JsonConvert.DeserializeObject<List<RichiestaAssistenzaRead>>(json);

            if (ListaRichieste != null)
            {
                string fileText = System.IO.File.ReadAllText(@"Fake/ListaRichiesteAssistenza.json");
                string jsonNew = JsonConvert.SerializeObject(richiestaAssistenza);
                System.IO.File.WriteAllText(@"Fake/ListaRichiesteAssistenza.json", "[" + fileText.Substring(1, fileText.Length - 2) + "," + jsonNew + "]");
            }
            else
            {
                List<RichiestaAssistenza> ListaRichiesteNew = new List<RichiestaAssistenza>();
                ListaRichiesteNew.Add(richiestaAssistenza);

                string jsonNew = JsonConvert.SerializeObject(ListaRichiesteNew);
                System.IO.File.WriteAllText(@"Fake/ListaRichiesteAssistenza.json", jsonNew);
            }
        }
    }
}
