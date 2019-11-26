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

            var codiceDistaccamento = "";
            var composizioneSquadre = JsonConvert.DeserializeObject<List<ComposizioneSquadre>>(json);
            var pathFiltri = CostantiJson.Filtri;
            string jsonFiltri;
            using (var r = new StreamReader(pathFiltri))
            {
                jsonFiltri = r.ReadToEnd();
            }
            var filtri = JsonConvert.DeserializeObject<API.Models.Classi.Filtri.Filtri>(jsonFiltri);
            if ((query.Filtro.CodiceDistaccamento?.Length > 0 && !string.IsNullOrEmpty(query.Filtro.CodiceDistaccamento[0]))
                || (!string.IsNullOrEmpty(query.Filtro.CodiceMezzo) && !string.IsNullOrEmpty(query.Filtro.CodiceMezzo))
                 || ((query.Filtro.CodiceSquadra?.Length > 0) && !string.IsNullOrEmpty(query.Filtro.CodiceSquadra[0]))
                 || (query.Filtro.CodiceStatoMezzo?.Length > 0 && !string.IsNullOrEmpty(query.Filtro.CodiceStatoMezzo[0]))
                 || (query.Filtro.CodiceTipoMezzo?.Length > 0 && !string.IsNullOrEmpty(query.Filtro.CodiceTipoMezzo[0])))
            {
                if (!string.IsNullOrEmpty(query.Filtro.CodiceMezzo) && !string.IsNullOrEmpty(query.Filtro.CodiceMezzo))
                {
                    var path = CostantiJson.Mezzo;
                    string jsonMezzi;
                    using (var r = new StreamReader(path))
                    {
                        jsonMezzi = r.ReadToEnd();
                    }
                    var mezzo = JsonConvert.DeserializeObject<List<Mezzo>>(jsonMezzi).Find(x => x.Codice == query.Filtro.CodiceMezzo);

                    if (mezzo != null)
                    {
                        //if (query.Filtro.CodiceStatoMezzo?.Length > 0 && !string.IsNullOrEmpty(query.Filtro.CodiceStatoMezzo[0]))
                        //{
                        //    var statiMezzi = filtri.Stati.Where(x => query.Filtro.CodiceStatoMezzo.Any(x.Id.Equals)).Select(x => x.Descrizione).ToArray();

                        //    if (!statiMezzi.Any(mezzo.Stato.Equals))
                        //    {
                        //        mezzo = null;
                        //        composizioneSquadre = null;
                        //    }
                        //}
                        if (query.Filtro.CodiceDistaccamento.Count() > 0 && !string.IsNullOrEmpty(query.Filtro.CodiceDistaccamento[0]))
                        {
                            if (mezzo != null && !query.Filtro.CodiceDistaccamento.Any(mezzo.Distaccamento.Codice.Equals))
                            {
                                mezzo = null;
                                composizioneSquadre = null;
                            }
                        }
                        //if (query.Filtro.CodiceTipoMezzo?.Length > 0 && !string.IsNullOrEmpty(query.Filtro.CodiceTipoMezzo[0]))
                        //{
                        //    var generiMezzi = filtri.GeneriMezzi.Where(x => query.Filtro.CodiceTipoMezzo.Any(x.Id.Equals)).Select(x => x.Descrizione).ToArray();
                        //    if (mezzo != null && !generiMezzi.Any(mezzo.Genere.Equals))
                        //    {
                        //        mezzo = null;
                        //        composizioneSquadre = null;
                        //    }
                        //}

                        if (mezzo != null)
                        {
                            codiceDistaccamento = mezzo.Distaccamento.Codice;

                            if (mezzo.IdRichiesta != null)
                            {
                                var getRichiesta = new GetRichiestaById();
                                var richiesta = getRichiesta.Get(mezzo.IdRichiesta);
                                var listaSquadre = richiesta.Partenze
                                    .Where(x => x.Partenza.Mezzo.Codice.Equals(mezzo.Codice))
                                    .Select(x => x.Partenza.Squadre);
                                composizioneSquadre = composizioneSquadre.Where(x => listaSquadre.Any(x.Squadra.Equals))
                                    .ToList();
                            }
                            else
                            {
                                composizioneSquadre = composizioneSquadre
                                   .Where(x => x.Squadra.Distaccamento.Codice == codiceDistaccamento).ToList();
                            }
                        }
                    }
                }
                if (query.Filtro.CodiceDistaccamento?.Length > 0 && !string.IsNullOrEmpty(query.Filtro.CodiceDistaccamento[0]))
                    composizioneSquadre = composizioneSquadre.Where(x => (query.Filtro.CodiceDistaccamento.Any(x.Squadra.Distaccamento.Codice.Equals))).ToList();
                if (query.Filtro.CodiceSquadra?.Length > 0 && !string.IsNullOrEmpty(query.Filtro.CodiceSquadra[0]))
                    composizioneSquadre = composizioneSquadre.Where(x => (query.Filtro.CodiceSquadra.Any(x.Squadra.Id.Equals))).ToList();

                return composizioneSquadre;
            }

            return composizioneSquadre;
        }
    }
}
