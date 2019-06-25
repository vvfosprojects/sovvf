//-----------------------------------------------------------------------
// <copyright file="GetResetPrenotazioneMezzo.cs" company="CNVVF">
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
using SO115App.Models.Servizi.Infrastruttura.GetResetPrenotazioneMezzo;
using DomainModel.CQRS.Commands.ResetPrenotazioneMezzo;

namespace SO115App.FakePersistenceJSon.Composizione
{
    public class GetResetPrenotazioneMezzo : IGetResetPrenotazioneMezzo
    {
        public MezzoPrenotato Get(ResetPrenotazioneMezzoCommand command)
        {
            //TODO PARTE CHIAMATA DB

            //TODO DA MODIFICARE CON LA CONNESSIONE AL DB PER IL REPERIMENTO DEI DATI DEFINITIVI
            //DATI FAKE - ORA LI LEGGO DA FILE
            List<ComposizioneMezzi> mezzi = new List<ComposizioneMezzi>();
            ComposizioneMezzi mezzo = new ComposizioneMezzi();
            MezzoPrenotato mezzoPrenotato = new MezzoPrenotato();
            //DateTime? istanteScadenzaPrecedente = null;
            //TimeSpan tempoPassato = new TimeSpan();
            //TimeSpan tempoMancante = new TimeSpan();
            //TimeSpan minutes = new TimeSpan(0, 3, 0);
            string filepath = "Fake/MezziComposizione.json";
            string json;
            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            mezzi = JsonConvert.DeserializeObject<List<ComposizioneMezzi>>(json);
            mezzo = mezzi.Where(x => x.Mezzo.Codice.Equals(command.MezzoPrenotato.mezzoComposizione.Mezzo.Codice)).FirstOrDefault();
            //istanteScadenzaPrecedente = mezzo.IstanteScadenzaSelezione;
            mezzi.Remove(mezzo);
            mezzo.IstanteScadenzaSelezione = DateTime.Now.AddSeconds(15);
           // tempoMancante = istanteScadenzaPrecedente.Value.Subtract(DateTime.Now);
            //tempoPassato = new TimeSpan(0, 3, 0) - istanteScadenzaPrecedente.Value.Subtract(DateTime.Now);
           //  mezzo.IstanteScadenzaSelezione = DateTime.Now.Add(tempoPassato);
            mezzi.Add(mezzo);
            mezzi.Sort(delegate (ComposizioneMezzi x, ComposizioneMezzi y)
            {
                return Convert.ToInt32(x.TempoPercorrenza.Substring(0, x.TempoPercorrenza.Length - 4)).CompareTo(Convert.ToInt32(y.TempoPercorrenza.Substring(0, y.TempoPercorrenza.Length - 4)));
            });
            string fileText = System.IO.File.ReadAllText(@"Fake/MezziComposizione.json");
            string jsonNew = JsonConvert.SerializeObject(mezzi);
            System.IO.File.WriteAllText(@"Fake/MezziComposizione.json", jsonNew);
            mezzoPrenotato.mezzoComposizione = mezzo;
            mezzoPrenotato.mezzoComposizione.Id = command.MezzoPrenotato.mezzoComposizione.Id;
            mezzoPrenotato.mezzoComposizione.IdRichiesta = command.MezzoPrenotato.mezzoComposizione.IdRichiesta;
            mezzoPrenotato.codiceSede = command.codiceSede;
            return mezzoPrenotato;
        }

        public ComposizioneMezzi GetMezzo(ResetPrenotazioneMezzoCommand command)
        {
            ComposizioneMezzi mezzo = new ComposizioneMezzi();
            List<ComposizioneMezzi> mezzi = new List<ComposizioneMezzi>();
            MezzoPrenotato mezzoPrenotato = new MezzoPrenotato();
            string filepath = "Fake/MezziComposizione.json";
            string json;
            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            mezzi = JsonConvert.DeserializeObject<List<ComposizioneMezzi>>(json);
            mezzo = mezzi.Where(x => x.Mezzo.Codice.Equals(command.MezzoPrenotato.mezzoComposizione.Mezzo.Codice)).FirstOrDefault();
            return mezzo;
        }
    }
}

