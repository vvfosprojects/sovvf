//-----------------------------------------------------------------------
// <copyright file="GetMezzoPrenotato.cs" company="CNVVF">
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
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.MezzoPrenotato;
using SO115App.Models.Servizi.Infrastruttura.GetMezzoPrenotato;
using DomainModel.CQRS.Commands.MezzoPrenotato;
using System;
using SO115App.API.Models.Classi.Condivise;
using SO115App.FakePersistence.JSon.Utility;

namespace SO115App.FakePersistenceJSon.Composizione
{
    public class GetMezzoPrenotato : IGetMezzoPrenotato
    {
        public MezzoPrenotato Get(MezzoPrenotatoCommand command)
        {
            //TODO PARTE CHIAMATA DB

            //TODO DA MODIFICARE CON LA CONNESSIONE AL DB PER IL REPERIMENTO DEI DATI DEFINITIVI
            //DATI FAKE - ORA LI LEGGO DA FILE
            var mezzoPrenotato = new MezzoPrenotato();
            var filepath = CostantiJson.Mezzo;
            string json;
            using (var r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            var mezzi = JsonConvert.DeserializeObject<List<Mezzo>>(json);
            var mezzo = mezzi.Find(x => x.Codice.Equals(command.MezzoPrenotato.MezzoComposizione.Mezzo.Codice));
            if (command.MezzoPrenotato.SbloccaMezzo)
            {
                mezzo.IstantePrenotazione = null;
            }
            else
            {
                mezzo.IstantePrenotazione = DateTime.Now.AddSeconds(15);
            }
            var composizioneMezzi = new ComposizioneMezzi
            {
                Id = Guid.NewGuid().ToString(),
                Mezzo = mezzo,
                IstanteScadenzaSelezione = mezzo.IstantePrenotazione
            };
            var jsonNew = JsonConvert.SerializeObject(mezzi);
            System.IO.File.WriteAllText(filepath, jsonNew);
            mezzoPrenotato.MezzoComposizione = composizioneMezzi;
            mezzoPrenotato.MezzoComposizione.Id = command.MezzoPrenotato.MezzoComposizione.Id;
            mezzoPrenotato.CodiceSede = command.CodiceSede;
            return mezzoPrenotato;
        }
    }
}
