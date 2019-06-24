//-----------------------------------------------------------------------
// <copyright file="GetPreAccoppiati.cs" company="CNVVF">
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
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.PreAccoppiati;
using SO115App.Models.Servizi.Infrastruttura.GetPreAccoppiati;

namespace SO115App.FakePersistenceJSon.Composizione
{
    public class GetPreAccoppiati : IGetPreAccoppiati
    {
        public List<PreAccoppiati> Get(PreAccoppiatiQuery query)
        {
            List<PreAccoppiati> preAccoppiati = new List<PreAccoppiati>();
            //TODO PARTE CHIAMATA DB

            //TODO DA MODIFICARE CON LA CONNESSIONE AL DB PER IL REPERIMENTO DEI DATI DEFINITIVI
            //DATI FAKE - ORA LI LEGGO DA FILE
            string filepath = "Fake/PreAccoppiatiComposizione.json";
            string json;
            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            preAccoppiati = JsonConvert.DeserializeObject<List<PreAccoppiati>>(json);
            List<ComposizioneSquadre> composizioneSquadre = new List<ComposizioneSquadre>();
            var squadra = new ComposizioneSquadre();
            var codiceDistaccamento = "";

            string[] generiMezzi = new string[50];
            string[] statiMezzi = new string[50];
            API.Models.Classi.Filtri.Filtri filtri = new API.Models.Classi.Filtri.Filtri();
            string pathFiltri = "Fake/Filtri.json";
            string jsonFiltri;
            using (StreamReader r = new StreamReader(pathFiltri))
            {
                jsonFiltri = r.ReadToEnd();
            }
            filtri = JsonConvert.DeserializeObject<API.Models.Classi.Filtri.Filtri>(jsonFiltri);

            if ((query.Filtro.CodiceDistaccamento != null && query.Filtro.CodiceDistaccamento.Length > 0 && !string.IsNullOrEmpty(query.Filtro.CodiceDistaccamento[0])) || (query.Filtro.CodiceMezzo != null && query.Filtro.CodiceMezzo.Length > 0 && !string.IsNullOrEmpty(query.Filtro.CodiceMezzo[0]))
                || (query.Filtro.CodiceSquadra != null && query.Filtro.CodiceSquadra.Length > 0) && !string.IsNullOrEmpty(query.Filtro.CodiceSquadra[0]) || (query.Filtro.CodiceStatoMezzo != null && query.Filtro.CodiceStatoMezzo.Length > 0 && string.IsNullOrEmpty(query.Filtro.CodiceStatoMezzo[0])) || (query.Filtro.CodiceTipoMezzo != null && query.Filtro.CodiceTipoMezzo.Length > 0 && string.IsNullOrEmpty(query.Filtro.CodiceTipoMezzo[0])))
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
                        preAccoppiati = preAccoppiati.Where(x => (x.MezzoComposizione.Mezzo.Distaccamento.Codice == codiceDistaccamento)).ToList();
                    }
                }
                if (query.Filtro.CodiceDistaccamento != null && query.Filtro.CodiceDistaccamento.Length > 0 && !string.IsNullOrEmpty(query.Filtro.CodiceDistaccamento[0]))
                    preAccoppiati = preAccoppiati.Where(x => query.Filtro.CodiceDistaccamento.Any(x.MezzoComposizione.Mezzo.Distaccamento.Codice.Equals)).ToList();
                if (query.Filtro.CodiceMezzo != null && query.Filtro.CodiceMezzo.Length > 0 && !string.IsNullOrEmpty(query.Filtro.CodiceMezzo[0]))
                    preAccoppiati = preAccoppiati.Where(x => query.Filtro.CodiceMezzo.Any(x.MezzoComposizione.Mezzo.Codice.Equals)).ToList();
                if (query.Filtro.CodiceStatoMezzo != null && query.Filtro.CodiceStatoMezzo.Length > 0 && !string.IsNullOrEmpty(query.Filtro.CodiceStatoMezzo[0]))
                {
                    statiMezzi = filtri.Stati.Where(x => query.Filtro.CodiceStatoMezzo.Any(x.Id.Equals)).Select(x => x.Descrizione).ToArray();
                    preAccoppiati = preAccoppiati.Where(x => statiMezzi.Any(x.MezzoComposizione.Mezzo.Stato.Equals)).ToList();
                }
                if (query.Filtro.CodiceTipoMezzo != null && query.Filtro.CodiceTipoMezzo.Length > 0 && !string.IsNullOrEmpty(query.Filtro.CodiceTipoMezzo[0]))
                {
                    generiMezzi = filtri.GeneriMezzi.Where(x => query.Filtro.CodiceTipoMezzo.Any(x.Id.Equals)).Select(x => x.Descrizione).ToArray();
                    preAccoppiati = preAccoppiati.Where(x => generiMezzi.Any(x.MezzoComposizione.Mezzo.Genere.Equals)).ToList();
                }
                return preAccoppiati;
            }
            else
            {
                return preAccoppiati;
            }
        }
    }
}
