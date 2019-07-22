//-----------------------------------------------------------------------
// <copyright file="PreAccoppiatiQueryHandler.cs" company="CNVVF">
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
using CQRS.Commands;
using CQRS.Queries;
using DomainModel.CQRS.Commands.PreAccoppiati;
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.GetPreAccoppiati;

namespace SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.PreAccoppiati
{
    /// <summary>
    ///   Servizio che restituisce tutti i valori dei Box presenti in HomePage.
    /// </summary>
    public class PreAccoppiatiCommandHandler : ICommandHandler<PreAccoppiatiCommand>
    {
        private readonly IGetPreAccoppiati _iGetPreAccoppiati;

        public PreAccoppiatiCommandHandler(IGetPreAccoppiati iGetPreAccoppiati)
        {
            this._iGetPreAccoppiati = iGetPreAccoppiati;
        }

        /// <summary>
        ///   Query che estrae i valori dei Box presenti in Home Page
        /// </summary>
        /// <param name="query">Filtri utilizzati per l'estrazione</param>
        /// <returns>Elenco dei mezzi disponibili</returns>
        //public PreAccoppiatiResult Handle(PreAccoppiatiQuery query)
        //{
        //    var preAccoppiati = new List<Classi.Composizione.PreAccoppiati>();
        //    preAccoppiati = _iGetPreAccoppiati.Get(query);
        //    preAccoppiati.Sort(delegate (Classi.Composizione.PreAccoppiati x, Classi.Composizione.PreAccoppiati y)
        //    {
        //        return Convert.ToInt32(x.MezzoComposizione.TempoPercorrenza.Substring(0, x.MezzoComposizione.TempoPercorrenza.Length - 4)).CompareTo(Convert.ToInt32(y.MezzoComposizione.TempoPercorrenza.Substring(0, y.MezzoComposizione.TempoPercorrenza.Length - 4)));
        //    });

        //    foreach (var preAccoppiato in preAccoppiati)
        //    {
        //        preAccoppiato.MezzoComposizione.IdRichiesta = query.Filtro.IdRichiesta;
        //    }
        //    // preparazione del DTO
        //    //preAccoppiati = CaricaPreAccoppiati(query);

        //    return new PreAccoppiatiResult()
        //    {
        //        PreAccoppiati = preAccoppiati
        //    };
        //}

        public void Handle(PreAccoppiatiCommand command)
        {
            var preAccoppiati = _iGetPreAccoppiati.Get(command);
            var composizioneMezziPrenotati = new List<Classi.Composizione.ComposizioneMezzi>();
            var preAccoppiatoDaPrenotare = new Classi.Composizione.PreAccoppiati();
            var preAccoppiatiDaPrenotareToAdd = new List<Classi.Composizione.PreAccoppiati>();
            //TODO PARTE CHIAMATA DB

            //TODO DA MODIFICARE CON LA CONNESSIONE AL DB PER IL REPERIMENTO DEI DATI DEFINITIVI
            //DATI FAKE - ORA LI LEGGO DA FILE
            string filepath = "Fake/MezziComposizione.json";
            string json;
            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }
            var composizioneMezzi = JsonConvert.DeserializeObject<List<Classi.Composizione.ComposizioneMezzi>>(json);

            foreach (var mezzo in composizioneMezzi)
            {
                if (mezzo.IstanteScadenzaSelezione != null && mezzo.IstanteScadenzaSelezione >= DateTime.Now)
                {
                    composizioneMezziPrenotati.Add(mezzo);
                }
            }
            foreach (var preAccoppiato in preAccoppiati)
            {
                if(preAccoppiato.MezzoComposizione.IstanteScadenzaSelezione != null && preAccoppiato.MezzoComposizione.IstanteScadenzaSelezione < DateTime.Now)
                {
                    preAccoppiato.MezzoComposizione.IstanteScadenzaSelezione = null;
                }
                if (composizioneMezziPrenotati.Count > 0)
                {
                    if (composizioneMezziPrenotati.Where(x => x.Mezzo.Codice == preAccoppiato.MezzoComposizione.Mezzo.Codice).ToList().Count > 0)
                    {
                        preAccoppiatoDaPrenotare = preAccoppiati.FirstOrDefault(x => x.MezzoComposizione.Mezzo.Codice == preAccoppiato.MezzoComposizione.Mezzo.Codice);
                        if (preAccoppiatoDaPrenotare != null)
                        {
                            preAccoppiatiDaPrenotareToAdd.Add(preAccoppiatoDaPrenotare);
                        }
                    }
                }
            
            }
            if (preAccoppiatiDaPrenotareToAdd.Count > 0)
            {
                foreach (Classi.Composizione.PreAccoppiati preAccoppiatodaPrenotareToAdd in preAccoppiatiDaPrenotareToAdd)
                {
                    preAccoppiati.Remove(preAccoppiatodaPrenotareToAdd);
                    preAccoppiatodaPrenotareToAdd.MezzoComposizione.IstanteScadenzaSelezione = composizioneMezziPrenotati.Where(x => x.Mezzo.Codice == preAccoppiatoDaPrenotare.MezzoComposizione.Mezzo.Codice).Select(x => x.IstanteScadenzaSelezione).FirstOrDefault();
                    preAccoppiatodaPrenotareToAdd.MezzoComposizione.IdRichiesta = command.Filtro.IdRichiesta;
                    preAccoppiati.Add(preAccoppiatodaPrenotareToAdd);
                    string fileText = System.IO.File.ReadAllText(@"Fake/PreAccoppiatiComposizione.json");
                    string jsonNew = JsonConvert.SerializeObject(preAccoppiati);
                    System.IO.File.WriteAllText(@"Fake/PreAccoppiatiComposizione.json", jsonNew);
                }
            }
            preAccoppiati.Sort(delegate (Classi.Composizione.PreAccoppiati x, Classi.Composizione.PreAccoppiati y)
            {
                return Convert.ToInt32(x.MezzoComposizione.TempoPercorrenza.Substring(0, x.MezzoComposizione.TempoPercorrenza.Length - 4)).CompareTo(Convert.ToInt32(y.MezzoComposizione.TempoPercorrenza.Substring(0, y.MezzoComposizione.TempoPercorrenza.Length - 4)));
            });

            command.Filtro.preAccoppiati = preAccoppiati;
        }
    }
}
