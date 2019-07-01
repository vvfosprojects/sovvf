//-----------------------------------------------------------------------
// <copyright file="GetMaxCodice.cs" company="CNVVF">
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
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;

namespace SO115App.FakePersistenceJSon.GestioneIntervento
{
    public class GetMaxCodice
    {
        public static int GetMax()
        {
            int MaxIdSintesi;

            string filepath = "Fake/ListaRichiesteAssistenza.json";
            string json;
            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            List<RichiestaAssistenzaRead> ListaRichieste = JsonConvert.DeserializeObject<List<RichiestaAssistenzaRead>>(json);

            if (ListaRichieste != null)
            {
                var idPRov = ListaRichieste.FindAll(x => x.CodiceRichiesta != null).OrderByDescending(x => x.CodiceRichiesta).FirstOrDefault() != null ? ListaRichieste.FindAll(x => x.CodiceRichiesta != null).OrderByDescending(x => x.CodiceRichiesta).FirstOrDefault().CodiceRichiesta.Split('-')[2] : "0";

                MaxIdSintesi = Convert.ToInt16(idPRov) + 1;
            }
            else
                MaxIdSintesi = 0;

            return MaxIdSintesi;
        }

        public static int GetMaxCodiceChiamata()
        {
            int MaxIdSintesi;

            string filepath = "Fake/ListaRichiesteAssistenza.json";
            string json;
            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            List<RichiestaAssistenzaRead> ListaRichieste = JsonConvert.DeserializeObject<List<RichiestaAssistenzaRead>>(json);

            if (ListaRichieste != null)
                MaxIdSintesi = Convert.ToInt16(ListaRichieste.OrderByDescending(x => x.Codice).FirstOrDefault().Codice.Split('_')[1]) + 1;
            else
                MaxIdSintesi = 0;

            return MaxIdSintesi;
        }
    }
}
