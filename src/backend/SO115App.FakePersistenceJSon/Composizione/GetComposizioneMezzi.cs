//-----------------------------------------------------------------------
// <copyright file="GetComposizioneMezzi.cs" company="CNVVF">
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
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.ComposizioneMezzi;
using SO115App.Models.Servizi.Infrastruttura.GetComposizioneMezzi;
using SO115App.API.Models.Classi.Filtri;

namespace SO115App.FakePersistenceJSon.Composizione
{
    public class GetComposizioneMezzi : IGetComposizioneMezzi
    {
        public List<ComposizioneMezzi> Get(ComposizioneMezziQuery query)
        {
            List<ComposizioneMezzi> composizioneMezzi = new List<ComposizioneMezzi>();
            //TODO PARTE CHIAMATA DB

            //TODO DA MODIFICARE CON LA CONNESSIONE AL DB PER IL REPERIMENTO DEI DATI DEFINITIVI
            //DATI FAKE - ORA LI LEGGO DA FILE
            string filepath = "Fake/MezziComposizione.json";
            string json;
            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            composizioneMezzi = JsonConvert.DeserializeObject<List<ComposizioneMezzi>>(json);

            List<ComposizioneSquadre> composizioneSquadre = new List<ComposizioneSquadre>();
            var squadra = new ComposizioneSquadre();
            string[] generiMezzi = new string[50];
            string[] statiMezzi= new string[50];
            var codiceDistaccamento = "";
            if ((query.Filtro.CodiceDistaccamento != null && query.Filtro.CodiceDistaccamento.Length > 0 && !string.IsNullOrEmpty(query.Filtro.CodiceDistaccamento[0]))
                || (query.Filtro.CodiceMezzo != null && query.Filtro.CodiceMezzo.Length > 0 && !string.IsNullOrEmpty(query.Filtro.CodiceMezzo[0]))
                || (query.Filtro.CodiceSquadra != null && query.Filtro.CodiceSquadra.Length > 0) && !string.IsNullOrEmpty(query.Filtro.CodiceSquadra[0])
                || (query.Filtro.CodiceStatoMezzo != null && query.Filtro.CodiceStatoMezzo.Length > 0 && !string.IsNullOrEmpty(query.Filtro.CodiceStatoMezzo[0]))
                || (query.Filtro.CodiceTipoMezzo != null && query.Filtro.CodiceTipoMezzo.Length > 0 && !string.IsNullOrEmpty(query.Filtro.CodiceTipoMezzo[0])))
            {
                if (query.Filtro.CodiceSquadra != null && query.Filtro.CodiceSquadra.Length > 0 && !string.IsNullOrEmpty(query.Filtro.CodiceSquadra[0]))
                {
                    string path = "Fake/SquadreComposizione.json";
                    string jsonSquadre;
                    using (StreamReader r = new StreamReader(path))
                    {
                        jsonSquadre = r.ReadToEnd();
                    }

                    composizioneSquadre = JsonConvert.DeserializeObject<List<ComposizioneSquadre>>(jsonSquadre);
                    squadra = composizioneSquadre.Where(x => query.Filtro.CodiceSquadra.Any(x.Squadra.Id.Equals)).FirstOrDefault();
                    if (squadra != null)
                    {
                        codiceDistaccamento = squadra.Squadra.Distaccamento.Codice;
                        composizioneMezzi = composizioneMezzi.Where(x => (x.Mezzo.Distaccamento.Codice == codiceDistaccamento)).ToList();
                    }
                }

                API.Models.Classi.Filtri.Filtri filtri = new API.Models.Classi.Filtri.Filtri();
                string pathFiltri = "Fake/Filtri.json";
                string jsonFiltri;
                using (StreamReader r = new StreamReader(pathFiltri))
                {
                    jsonFiltri = r.ReadToEnd();
                }
                filtri = JsonConvert.DeserializeObject<API.Models.Classi.Filtri.Filtri>(jsonFiltri);


                if (query.Filtro.CodiceDistaccamento != null && query.Filtro.CodiceDistaccamento.Length > 0 && !string.IsNullOrEmpty(query.Filtro.CodiceDistaccamento[0]))
                    composizioneMezzi = composizioneMezzi.Where(x => query.Filtro.CodiceDistaccamento.Any(x.Mezzo.Distaccamento.Codice.Equals)).ToList();

               // if (query.Filtro.CodiceMezzo != null && query.Filtro.CodiceMezzo.Length > 0 && !string.IsNullOrEmpty(query.Filtro.CodiceMezzo[0]))
                 //   composizioneMezzi = composizioneMezzi.Where(x => query.Filtro.CodiceMezzo.Any(x.Mezzo.Codice.Equals)).ToList();



                if (query.Filtro.CodiceStatoMezzo != null && query.Filtro.CodiceStatoMezzo.Length > 0 && !string.IsNullOrEmpty(query.Filtro.CodiceStatoMezzo[0]))
                {
                    statiMezzi = filtri.Stati.Where(x => query.Filtro.CodiceStatoMezzo.Any(x.Id.Equals)).Select(x => x.Descrizione).ToArray();
                    composizioneMezzi = composizioneMezzi.Where(x => statiMezzi.Any(x.Mezzo.Stato.Equals)).ToList();
                }

                if (query.Filtro.CodiceTipoMezzo != null && query.Filtro.CodiceTipoMezzo.Length > 0 && !string.IsNullOrEmpty(query.Filtro.CodiceTipoMezzo[0]))
                {
                    generiMezzi = filtri.GeneriMezzi.Where(x => query.Filtro.CodiceTipoMezzo.Any(x.Id.Equals)).Select(x => x.Descrizione).ToArray();
                    composizioneMezzi = composizioneMezzi.Where(x => generiMezzi.Any(x.Mezzo.Genere.Equals)).ToList();
                }

                if (query.Filtro.CodiceMezzo != null && query.Filtro.CodiceMezzo.Length > 0 && !string.IsNullOrEmpty(query.Filtro.CodiceMezzo[0]) && !(query.Filtro.CodiceTipoMezzo != null && query.Filtro.CodiceTipoMezzo.Length > 0 && !string.IsNullOrEmpty(query.Filtro.CodiceTipoMezzo[0])) && !(query.Filtro.CodiceStatoMezzo != null && query.Filtro.CodiceStatoMezzo.Length > 0 && !string.IsNullOrEmpty(query.Filtro.CodiceStatoMezzo[0]))&& !(query.Filtro.CodiceDistaccamento != null && query.Filtro.CodiceDistaccamento.Length > 0 && !string.IsNullOrEmpty(query.Filtro.CodiceDistaccamento[0])))
                    composizioneMezzi = null;

                return composizioneMezzi;
            }
            else
            {
                return composizioneMezzi;
            }
        }
    }
}
