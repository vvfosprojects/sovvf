//-----------------------------------------------------------------------
// <copyright file="GetRichiestaById.cs" company="CNVVF">
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
using AutoMapper;
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Classi.Soccorso.Eventi;
using SO115App.API.Models.Classi.Soccorso.Eventi.Segnalazioni;
using SO115App.FakePersistenceJSon.Classi;
using SO115App.FakePersistenceJSon.Utility;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;

namespace SO115App.FakePersistenceJSon.GestioneIntervento
{
    public class GetRichiestaById : IGetRichiestaById
    {
        public RichiestaAssistenza Get(string idRichiestaAssistenza)
        {
            string filepath = "Fake/ListaRichiesteAssistenza.json";
            string json;

            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            List<RichiestaAssistenzaDTO> ListaRichieste = JsonConvert.DeserializeObject<List<RichiestaAssistenzaDTO>>(json);

            RichiestaAssistenzaDTO richiesta = (RichiestaAssistenzaDTO)ListaRichieste.FirstOrDefault(x => x.Codice == idRichiestaAssistenza);

            RichiestaAssistenza richiestaReturn = MapperDTO.MapRichiestaDTOtoRichiesta(richiesta);

            return richiestaReturn;
        }
    }
}
