//-----------------------------------------------------------------------
// <copyright file="GetComposizioneSquadre.cs" company="CNVVF">
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
using SO115App.API.Models.Classi.Composizione;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.ComposizioneSquadre;
using SO115App.FakePersistence.JSon.Utility;
using SO115App.FakePersistenceJSon.GestioneIntervento;
using SO115App.Models.Servizi.Infrastruttura.GetComposizioneSquadre;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace SO115App.FakePersistenceJSon.Composizione
{
    public class GetComposizioneSquadre : IGetComposizioneSquadre
    {
        public List<ComposizioneSquadre> Get(ComposizioneSquadreQuery query)
        {
            var filepath = CostantiJson.SquadreComposizione;
            string json;
            using (var r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }
            var composizioneSquadre = JsonConvert.DeserializeObject<List<ComposizioneSquadre>>(json);

            return composizioneSquadre;
        }
    }
}
