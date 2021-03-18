﻿//-----------------------------------------------------------------------
// <copyright file="ComposizioneSquadreQueryHandler.cs" company="CNVVF">
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

using CQRS.Queries;
using Google_API;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Serilog;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Classi.Utenti;
using SO115App.Models.Classi.Composizione;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using SO115App.Models.Servizi.Infrastruttura.GeoFleet;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.GestioneTipologie;
using SO115App.Models.Servizi.Infrastruttura.GestioneStatoOperativoSquadra;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Gac;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Squadre;
using SO115App.Models.Servizi.Infrastruttura.Turni;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.ComposizionePartenzaAvanzata
{
    public class ComposizionePartenzaAvanzataQueryHandler : IQueryHandler<ComposizionePartenzaAvanzataQuery, ComposizionePartenzaAvanzataResult>
    {
        private readonly IGetListaSquadre _getListaSquadre;
        private readonly IGetMezziUtilizzabili _getMezziUtilizzabili;
        private readonly IGetStatoSquadra _getStatoSquadre;
        private readonly IGetStatoMezzi _getMezziPrenotati;
        private readonly IGetPosizioneFlotta _getPosizioneFlotta;

        private readonly IGetTipologieByCodice _getTipologieByCodice;
        private readonly IConfiguration _configuration;
        private readonly IMemoryCache _memoryCache;
        private readonly IGetTurno _getTurno;

        public ComposizionePartenzaAvanzataQueryHandler(
            IGetListaSquadre getListaSquadre,
            IGetStatoSquadra getStatoSquadre,
            IGetStatoMezzi getMezziPrenotati,
            IGetMezziUtilizzabili getMezziUtilizzabili,
            IGetPosizioneFlotta getPosizioneFlotta,

            IGetTipologieByCodice getTipologieByCodice,
            IConfiguration configuration,
            IMemoryCache memoryCache,
            IGetTurno getTurno)
        {
            _getListaSquadre = getListaSquadre;
            _getMezziPrenotati = getMezziPrenotati;
            _getMezziUtilizzabili = getMezziUtilizzabili;
            _getStatoSquadre = getStatoSquadre;
            _getPosizioneFlotta = getPosizioneFlotta;

            _getTipologieByCodice = getTipologieByCodice;
            _configuration = configuration;
            _memoryCache = memoryCache;
            _getTurno = getTurno;
        }

        public ComposizionePartenzaAvanzataResult Handle(ComposizionePartenzaAvanzataQuery query)
        {
            Log.Debug("Inizio elaborazione Composizione partenza avanzata Handler");

            var lstSedi = query.CodiceSede.ToList();

            //CALCOLO I TURNI
            var turnoCorrente = _getTurno.Get();
            string turnoPrecedente = null;
            string turnoSuccessivo = null;

            if(query.Filtro.Turno != null)
            {
                if(turnoCorrente.Codice.Contains('A'))
                { 
                    turnoPrecedente = "D"; 
                    turnoSuccessivo = "B"; 
                }
                else if(turnoCorrente.Codice.Contains('B'))
                {
                    turnoPrecedente = "A";
                    turnoSuccessivo = "C";
                }
                else if (turnoCorrente.Codice.Contains('C'))
                {
                    turnoPrecedente = "B";
                    turnoSuccessivo = "D";
                }
                else if (turnoCorrente.Codice.Contains('D'))
                {
                    turnoPrecedente = "C";
                    turnoSuccessivo = "A";
                }
            }

            //REPERISCO I DATI, FACCIO IL MAPPING ED APPLICO I FILTRI (MEZZI E SQUADRE)
            var lstSquadre = _getListaSquadre.Get(lstSedi)
                .ContinueWith(lstsquadre => //Mapping 
                {
                    var statiOperativi = _getStatoSquadre.Get(lstSedi);

                    return lstsquadre.Result.Select(squadra =>
                    {
                        if (statiOperativi.Exists(x => x.IdSquadra.Equals(squadra.Id)))
                        {
                            squadra.Stato = MappaStatoSquadraDaStatoMezzo.MappaStato(statiOperativi.Find(x => x.IdSquadra.Equals(squadra.Id)).StatoSquadra);
                            squadra.IndiceOrdinamento = -200;
                        }
                        else
                            squadra.Stato = Squadra.StatoSquadra.InSede;

                        return new Classi.Composizione.ComposizioneSquadre()
                        {
                            Id = squadra.Id,
                            Squadra = squadra
                        };
                    });
                })
                .ContinueWith(lstCompSquadre => //Filtri 
                {
                    return lstCompSquadre.Result.Where(s =>
                    {
                        if (!string.IsNullOrEmpty(query.Filtro.RicercaSquadre))
                            return s.Squadra.Codice.Contains(query.Filtro.RicercaSquadre);
                        return true;
                    }).Where(s =>
                    {
                        if (query.Filtro.CodiceDistaccamento != null && query.Filtro.CodiceDistaccamento.All(c => c != ""))
                            return query.Filtro.CodiceDistaccamento.Contains(s.Squadra.Distaccamento.Codice);
                        return true;
                    }).Where(s =>
                    {
                        if (query.Filtro.Squadre != null && query.Filtro.Squadre.Count > 0 && query.Filtro.Squadre.FirstOrDefault().Distaccamento.Codice != null)
                            return s.Squadra.Distaccamento.Codice == query.Filtro.Squadre.FirstOrDefault().Distaccamento.Codice;
                        return true;
                    }).Where(s =>
                    {
                        if (turnoPrecedente != null)
                            return turnoPrecedente.Contains(s.Squadra.Turno);
                        else if (turnoPrecedente != null)
                            return turnoSuccessivo.Contains(s.Squadra.Turno);
                        return turnoCorrente.Codice.Contains(s.Squadra.Turno);
                    }).Where(m =>
                    {
                        if (query.Filtro.Mezzo != null && query.Filtro.Mezzo.Distaccamento.Codice != null)
                            return m.Squadra.Distaccamento.Codice == query.Filtro.Mezzo.Distaccamento.Codice;
                        return true;
                    }).OrderByDescending(c => c.Squadra.Stato).ToList();
                });

            var lstMezzi = _getPosizioneFlotta.Get(0)
                .ContinueWith(lstPosizioneFlotta => _getMezziUtilizzabili.Get(lstSedi, posizioneFlotta: lstPosizioneFlotta.Result).Result)
                .ContinueWith(lstmezzi => //Mapping 
                {
                    var composizioneMezzi = (from mezzo in lstmezzi.Result
                                             let kmGen = new Random().Next(1, 60).ToString()
                                             let tempoPer = Convert.ToDouble(kmGen.Replace(".", ",")) / 1.75
                                             select new Classi.Composizione.ComposizioneMezzi()
                                             {
                                                 Id = mezzo.Codice,
                                                 Mezzo = mezzo,
                                                 Km = kmGen,
                                                 TempoPercorrenza = Math.Round(tempoPer, 2).ToString(CultureInfo.InvariantCulture),
                                             }).ToList();

                    var mezziPrenotati = _getMezziPrenotati.Get(query.CodiceSede);

                    decimal totaleKM = 0;
                    decimal totaleTempoPercorrenza = 0;
                    string mediaDistanza;
                    string mediaTempoPercorrenza;

                    return composizioneMezzi.Select(c =>
                    {
                        if (c.IstanteScadenzaSelezione < DateTime.Now)
                            c.IstanteScadenzaSelezione = null;

                        if (mezziPrenotati.Find(x => x.CodiceMezzo.Equals(c.Mezzo.Codice)) != null)
                        {
                            c.Id = c.Mezzo.Codice;
                            c.IstanteScadenzaSelezione = mezziPrenotati.Find(x => x.CodiceMezzo.Equals(c.Mezzo.Codice)).IstanteScadenzaSelezione;

                            if (c.Mezzo.Stato.Equals("In Sede"))
                                c.Mezzo.Stato = mezziPrenotati.Find(x => x.CodiceMezzo.Equals(c.Mezzo.Codice)).StatoOperativo;
                        }

                        //Per i mezzi con coordinate Fake nella property  i Km  e la TempoPercorrenza vengono impostati i  valori medi della collection
                        totaleKM += Convert.ToDecimal(c.Km.Replace(".", ","));
                        totaleTempoPercorrenza += Convert.ToDecimal(c.TempoPercorrenza.Replace(".", ","));

                        mediaDistanza = Math.Round(totaleKM / composizioneMezzi.Count(), 2).ToString(CultureInfo.InvariantCulture);
                        mediaTempoPercorrenza = Math.Round(totaleTempoPercorrenza / composizioneMezzi.Count(), 2).ToString(CultureInfo.InvariantCulture);

                        c.Km = mediaDistanza;
                        c.TempoPercorrenza = mediaTempoPercorrenza;
                        c.IndiceOrdinamento = new OrdinamentoMezzi(query.Richiesta, _getTipologieByCodice, _configuration, _memoryCache).GetIndiceOrdinamento(c, c.Mezzo.CoordinateFake);

                        return c;
                    });
                })
                .ContinueWith(lstCompMezzi => //Filtri 
                {
                    return lstCompMezzi.Result.Where(m =>
                    {
                        if (query.Filtro.StatoMezzo != null)
                            return query.Filtro.StatoMezzo.Contains(m.Mezzo.Stato.ToString());
                        return true;
                    }).Where(m =>
                    {
                        if (!string.IsNullOrEmpty(query.Filtro.RicercaMezzi)) 
                            return m.Mezzo.Codice.Contains(query.Filtro.RicercaMezzi) || m.Mezzo.Descrizione.Contains(query.Filtro.RicercaMezzi);
                        return true;
                    }).Where(m =>
                    {
                        if (query.Filtro.CodiceDistaccamento != null && query.Filtro.CodiceDistaccamento.All(c => c != ""))
                            return query.Filtro.CodiceDistaccamento.Contains(m.Mezzo.Distaccamento.Codice);
                        return true;
                    }).Where(m =>
                    {
                        if (query.Filtro.TipoMezzo != null && query.Filtro.TipoMezzo.All(c => c != ""))
                            return query.Filtro.TipoMezzo.Contains(m.Mezzo.Genere);
                        return true;
                    }).Where(m =>
                    {
                        if (query.Filtro.StatoMezzo != null && query.Filtro.StatoMezzo.All(c => c != ""))
                            return query.Filtro.StatoMezzo.Contains(m.Mezzo.Stato);
                        return true;
                    }).Where(s =>
                    {
                        if (query.Filtro.Squadre != null && query.Filtro.Squadre.Count > 0 && query.Filtro.Squadre.FirstOrDefault().Distaccamento.Codice != null)
                            return s.Mezzo.Distaccamento.Codice == query.Filtro.Squadre.FirstOrDefault().Distaccamento.Codice;
                        return true;
                    }).Where(m =>
                    {
                        if (query.Filtro.Mezzo != null && query.Filtro.Mezzo.Distaccamento.Codice != null)
                            return m.Mezzo.Distaccamento.Codice == query.Filtro.Mezzo.Distaccamento.Codice;
                        return true;
                    }).OrderBy(x => x.Mezzo.Stato).ThenByDescending(c => c.IndiceOrdinamento).ToList();
                });

            //PREPARO PAGINAZIONE IN BASE AI FILTRI
            var indexMezzo = query.Filtro.Mezzo != null ? lstMezzi.Result.FindIndex(c => c.Mezzo.Codice.Equals(query.Filtro.Mezzo.Codice)) : 0;
            var indexSquadra = query.Filtro.Squadre != null ? lstSquadre.Result.FindIndex(c => c.Squadra.Codice.Equals(query.Filtro.Squadre.FirstOrDefault().Codice)) : 0;

            if (indexMezzo != 0)
                query.Filtro.MezziPagination.Page = (indexMezzo + 1) / query.Filtro.MezziPagination.PageSize + 1;

            if (indexSquadra != 0)
                query.Filtro.SquadrePagination.Page = (indexSquadra + 1) / query.Filtro.SquadrePagination.PageSize + 1;

            //COMPONGO IL DTO E FACCIO LA PAGINAZIONE
            var composizioneAvanzata = new Classi.Composizione.ComposizionePartenzaAvanzata()
            {
                ComposizioneMezziDataArray = lstMezzi.Result
                    .Skip(query.Filtro.MezziPagination.PageSize * (query.Filtro.MezziPagination.Page - 1))
                    .Take(query.Filtro.MezziPagination.PageSize).ToList(),

                ComposizioneSquadreDataArray = lstSquadre.Result
                    .Skip(query.Filtro.SquadrePagination.PageSize * (query.Filtro.SquadrePagination.Page - 1))
                    .Take(query.Filtro.SquadrePagination.PageSize).ToList(),

                MezziPagination = new Paginazione()
                {
                    Page = query.Filtro.MezziPagination.Page,
                    PageSize = query.Filtro.MezziPagination.PageSize,
                    TotalItems = lstMezzi.Result.Count
                },
                SquadrePagination = new Paginazione()
                {
                    Page = query.Filtro.SquadrePagination.Page,
                    PageSize = query.Filtro.SquadrePagination.PageSize,
                    TotalItems = lstSquadre.Result.Count
                }
            };

            Log.Debug("Fine elaborazione Composizione partenza avanzata Handler");

            return new ComposizionePartenzaAvanzataResult()
            {
                ComposizionePartenzaAvanzata = composizioneAvanzata
            };
        }
    }

    internal class OrdinamentoMezzi
    {
        private readonly RichiestaAssistenza _Richiesta;
        private readonly IGetTipologieByCodice _getTipologieByCodice;
        private readonly IConfiguration _configuration;
        private readonly IMemoryCache _memoryCache;

        public OrdinamentoMezzi(RichiestaAssistenza Richiesta, IGetTipologieByCodice getTipologieByCodice, IConfiguration configuration, IMemoryCache memoryCache)
        {
            _Richiesta = Richiesta;
            _getTipologieByCodice = getTipologieByCodice;
            _configuration = configuration;
            _memoryCache = memoryCache;
        }

        public decimal GetIndiceOrdinamento(Classi.Composizione.ComposizioneMezzi composizione, bool CoordinateFake)
        {
            int ValoreIntOriginePerSganciamento = 0;
            decimal ValoreAdeguatezzaMezzo;

            ValoreAdeguatezzaMezzo = GeneraValoreAdeguatezzaMezzo(_Richiesta.Tipologie, composizione.Mezzo.Genere);

            if (!CoordinateFake)
                composizione = GetDistanceByGoogle(composizione, _Richiesta).Result;

            return 100 / (1 + Convert.ToDecimal(composizione.TempoPercorrenza.Replace(".", ",")) / 5400) + ValoreIntOriginePerSganciamento + ValoreAdeguatezzaMezzo;
        }

        private async Task<Classi.Composizione.ComposizioneMezzi> GetDistanceByGoogle(Classi.Composizione.ComposizioneMezzi composizione, RichiestaAssistenza richiesta)
        {
            var origine = $"origins={ composizione.Mezzo.Coordinate.Latitudine.ToString().Replace(",", ".")},{ composizione.Mezzo.Coordinate.Longitudine.ToString().Replace(",", ".")}";
            var destination = $"destinations={ richiesta.Localita.Coordinate.Latitudine.ToString().Replace(",", ".")},{ richiesta.Localita.Coordinate.Longitudine.ToString().Replace(",", ".")}";
            var mode = "mode=Driving";
            var sensor = "sensor=false";

            var queryString = new StringContent("");

            //CACHE
            DistanceMatrix distanza;
            var nomeCache = "DistanceMatrix_";
            using var _client = new HttpClient();

            if (!_memoryCache.TryGetValue(nomeCache, out distanza))
            {
                var response = await _client.PostAsync(_configuration.GetSection("UrlExternalApi").GetSection("DistanceMatrix").Value + $"&{origine}&{destination}&{mode}&{sensor}", queryString).ConfigureAwait(false);
                response.EnsureSuccessStatusCode();
                using HttpContent content = response.Content;
                
                string data = await content.ReadAsStringAsync().ConfigureAwait(false);
                distanza = JsonConvert.DeserializeObject<DistanceMatrix>(data);

                var cacheEntryOptions = new MemoryCacheEntryOptions().SetSlidingExpiration(TimeSpan.FromHours(8));
                _memoryCache.Set(nomeCache, distanza, cacheEntryOptions);
            }
            //FINE CACHE

            if (distanza.Rows[0].Elements[0].Distance != null)
            {
                //LE Value sono espresse in SECONDI
                composizione.Km = distanza.Rows[0].Elements[0].Distance.Text.ToString().Substring(0, distanza.Rows[0].Elements[0].Distance.Text.ToString().Length - 2);
                composizione.TempoPercorrenza = (distanza.Rows[0].Elements[0].Duration.Value / 60).ToString();
            }
            else
            {
                composizione.Km = "100";
                composizione.TempoPercorrenza = "50";
            }

            return composizione;
        }

        private decimal GeneraValoreAdeguatezzaMezzo(List<string> codiciTipologie, string genere)
        {
            foreach (var tipologia in _getTipologieByCodice.Get(codiciTipologie))
            {
                if (tipologia != null)
                {
                    return genere switch
                    {
                        "APS" => Convert.ToDecimal(tipologia.AdeguatezzaMezzo.Aps),
                        "AS" => Convert.ToDecimal(tipologia.AdeguatezzaMezzo.As),
                        "AB" => Convert.ToDecimal(tipologia.AdeguatezzaMezzo.Ab),
                        "AV" => Convert.ToDecimal(tipologia.AdeguatezzaMezzo.Av),
                        "AG" => Convert.ToDecimal(tipologia.AdeguatezzaMezzo.Ag),
                        _ => Convert.ToDecimal(tipologia.AdeguatezzaMezzo.Default),
                    };
                }
            }
            return 10;
        }
    }
}
