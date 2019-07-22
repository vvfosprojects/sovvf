//-----------------------------------------------------------------------
// <copyright file="GetBoxMezzi.cs" company="CNVVF">
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
using System.Security.Cryptography.X509Certificates;
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Boxes;
using SO115App.API.Models.Classi.Composizione;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.ComposizioneMezzi;
using SO115App.Models.Servizi.Infrastruttura.Box;

namespace SO115App.FakePersistenceJSon.Box
{
    public class GetBoxMezzi : IGetBoxMezzi
    {
        public BoxMezzi Get()
        {
            var listaComposizioneMezzi = new List<ComposizioneMezzi>();
            var mezzi = new BoxMezzi();


            string filepath = "Fake/MezziComposizione.json";
            string json;
            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            listaComposizioneMezzi = JsonConvert.DeserializeObject<List<ComposizioneMezzi>>(json);

            mezzi.InSede = listaComposizioneMezzi.Where(x => x.Mezzo.Stato == "In Sede")
                .Select(x => x.Mezzo.Stato)
                .Count();
            mezzi.InViaggio = listaComposizioneMezzi.Where(x => x.Mezzo.Stato == "In Viaggio")
                .Select(x => x.Mezzo.Stato)
                .Count();
            mezzi.InRientro = listaComposizioneMezzi.Where(x => x.Mezzo.Stato == "In Rientro")
                .Select(x => x.Mezzo.Stato)
                .Count();
            mezzi.SulPosto = listaComposizioneMezzi.Where(x => x.Mezzo.Stato == "Sul Posto")
                .Select(x => x.Mezzo.Stato)
                .Count();
            mezzi.Istituto = listaComposizioneMezzi.Where(x => x.Mezzo.Stato == "Istituto")
                .Select(x => x.Mezzo.Stato)
                .Count();
            mezzi.InServizio = mezzi.InSede + mezzi.InRientro + mezzi.SulPosto + mezzi.Istituto + mezzi.InViaggio;

            return mezzi;
        }
    }
}
