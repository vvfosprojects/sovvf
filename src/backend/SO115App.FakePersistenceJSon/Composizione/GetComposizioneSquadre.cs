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
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Composizione;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.ComposizioneSquadre;
using SO115App.FakePersistence.JSon.Utility;
using SO115App.FakePersistenceJSon.GestioneIntervento;
using SO115App.Models.Servizi.Infrastruttura.GetComposizioneSquadre;

namespace SO115App.FakePersistenceJSon.Composizione
{
    public class GetComposizioneSquadre : IGetComposizioneSquadre
    {
        public List<ComposizioneSquadre> Get(ComposizioneSquadreQuery query)
        {
            //TODO PARTE CHIAMATA DB

            //TODO DA MODIFICARE CON LA CONNESSIONE AL DB PER IL REPERIMENTO DEI DATI DEFINITIVI
            //DATI FAKE - ORA LI LEGGO DA FILE
            string filepath = CostantiJson.SquadreComposizione;
            string json;
            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }
            List<ComposizioneMezzi> composizioneMezzi = new List<ComposizioneMezzi>();
            ComposizioneMezzi mezzo = new ComposizioneMezzi();
            var codiceDistaccamento = "";
            List<ComposizioneSquadre> composizioneSquadre = JsonConvert.DeserializeObject<List<ComposizioneSquadre>>(json);
            string[] generiMezzi = new string[50];
            string[] statiMezzi = new string[50];
            API.Models.Classi.Filtri.Filtri filtri = new API.Models.Classi.Filtri.Filtri();
            string pathFiltri = CostantiJson.Filtri;
            string jsonFiltri;
            using (StreamReader r = new StreamReader(pathFiltri))
            {
                jsonFiltri = r.ReadToEnd();
            }
            filtri = JsonConvert.DeserializeObject<API.Models.Classi.Filtri.Filtri>(jsonFiltri);
            if ((query.Filtro.CodiceDistaccamento?.Length > 0 && !string.IsNullOrEmpty(query.Filtro.CodiceDistaccamento[0]))
                || (!string.IsNullOrEmpty(query.Filtro.CodiceMezzo) && !string.IsNullOrEmpty(query.Filtro.CodiceMezzo))
                 || ((query.Filtro.CodiceSquadra?.Length > 0) && !string.IsNullOrEmpty(query.Filtro.CodiceSquadra[0]))
                 || (query.Filtro.CodiceStatoMezzo?.Length > 0 && !string.IsNullOrEmpty(query.Filtro.CodiceStatoMezzo[0]))
                 || (query.Filtro.CodiceTipoMezzo?.Length > 0 && !string.IsNullOrEmpty(query.Filtro.CodiceTipoMezzo[0])))
            {
                if (!string.IsNullOrEmpty(query.Filtro.CodiceMezzo) && !string.IsNullOrEmpty(query.Filtro.CodiceMezzo))
                {
                    string path = CostantiJson.MezziComposizione;
                    string jsonMezzi;
                    using (StreamReader r = new StreamReader(path))
                    {
                        jsonMezzi = r.ReadToEnd();
                    }
                    composizioneMezzi = JsonConvert.DeserializeObject<List<ComposizioneMezzi>>(jsonMezzi);
                    mezzo = composizioneMezzi.Find(x => x.Mezzo.Codice == query.Filtro.CodiceMezzo);
                    if (mezzo != null)
                    {
                        if (query.Filtro.CodiceStatoMezzo?.Length > 0 && !string.IsNullOrEmpty(query.Filtro.CodiceStatoMezzo[0]))
                        {
                            statiMezzi = filtri.Stati.Where(x => query.Filtro.CodiceStatoMezzo.Any(x.Id.Equals)).Select(x => x.Descrizione).ToArray();

                            if (!statiMezzi.Any(mezzo.Mezzo.Stato.Equals))
                            {
                                mezzo = null;
                                composizioneSquadre = null;
                            }
                        }
                        if (query.Filtro.CodiceDistaccamento?.Length > 0 && !string.IsNullOrEmpty(query.Filtro.CodiceDistaccamento[0]))
                        {
                            if (!query.Filtro.CodiceDistaccamento.Any(mezzo.Mezzo.Distaccamento.Codice.Equals))
                            {
                                mezzo = null;
                                composizioneSquadre = null;
                            }
                        }
                        if (query.Filtro.CodiceTipoMezzo?.Length > 0 && !string.IsNullOrEmpty(query.Filtro.CodiceTipoMezzo[0]))
                        {
                            generiMezzi = filtri.GeneriMezzi.Where(x => query.Filtro.CodiceTipoMezzo.Any(x.Id.Equals)).Select(x => x.Descrizione).ToArray();
                            if (!generiMezzi.Any(mezzo.Mezzo.Genere.Equals))
                            {
                                mezzo = null;
                                composizioneSquadre = null;
                            }
                        }
                        codiceDistaccamento = mezzo.Mezzo.Distaccamento.Codice;

                        if (mezzo.Mezzo.IdRichiesta != null)
                        {
                            GetRichiestaById getRichiesta = new GetRichiestaById();
                            RichiestaAssistenza richiesta = getRichiesta.Get(mezzo.Mezzo.IdRichiesta);
                            var ListaSquadre = richiesta.Partenze.Where(x => x.Partenza.Mezzo.Codice.Equals(mezzo.Id)).Select(x => x.Partenza.Squadre);
                            composizioneSquadre = composizioneSquadre.Where(x => ListaSquadre.Any(x.Squadra.Equals)).ToList();
                        }
                        else
                            composizioneSquadre = composizioneSquadre.Where(x => x.Squadra.Distaccamento.Codice == codiceDistaccamento).ToList();
                    }
                }
                if (query.Filtro.CodiceDistaccamento?.Length > 0 && !string.IsNullOrEmpty(query.Filtro.CodiceDistaccamento[0]))
                    composizioneSquadre = composizioneSquadre.Where(x => (query.Filtro.CodiceDistaccamento.Any(x.Squadra.Distaccamento.Codice.Equals))).ToList();
                if (query.Filtro.CodiceSquadra?.Length > 0 && !string.IsNullOrEmpty(query.Filtro.CodiceSquadra[0]))
                    composizioneSquadre = composizioneSquadre.Where(x => (query.Filtro.CodiceSquadra.Any(x.Squadra.Id.Equals))).ToList();

                return composizioneSquadre;
            }
            else
            {
                return composizioneSquadre;
            }
        }
    }
}
