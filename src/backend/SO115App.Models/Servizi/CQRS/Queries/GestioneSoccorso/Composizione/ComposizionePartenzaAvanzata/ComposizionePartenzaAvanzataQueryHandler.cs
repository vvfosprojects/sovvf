//-----------------------------------------------------------------------
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
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Serilog;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Organigramma;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using SO115App.Models.Servizi.Infrastruttura.GestioneStatoOperativoSquadra;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Gac;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Personale;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Squadre;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.ComposizionePartenzaAvanzata
{
    public class ComposizionePartenzaAvanzataQueryHandler : IQueryHandler<ComposizionePartenzaAvanzataQuery, ComposizionePartenzaAvanzataResult>
    {
        private readonly IGetListaSquadre _getListaSquadre;
        private readonly IGetStatoSquadra _getStatoSquadre;
        private readonly IGetStatoMezzi _getMezziPrenotati;
        private readonly IGetMezziUtilizzabili _getMezziUtilizzabili;

        ////private readonly HttpClient _client;
        //private readonly IConfiguration _configuration;
        //private readonly IGetDistaccamentoByCodiceSedeUC _getDistaccamentoByCodiceSedeUC;
        //private readonly IGetPersonaleByCF _getPersonaleByCF;
        //private readonly IGetAlberaturaUnitaOperative _getAlberaturaUnitaOperative;
        //private readonly IMemoryCache _memoryCache;

        public ComposizionePartenzaAvanzataQueryHandler(
            IGetListaSquadre getListaSquadre,
            IGetStatoSquadra getStatoSquadre, 
            IGetStatoMezzi getMezziPrenotati, 
            IGetMezziUtilizzabili getMezziUtilizzabili

            //IConfiguration configuration,
            //IGetDistaccamentoByCodiceSedeUC getDistaccamentoByCodiceSedeUC,
            //IGetPersonaleByCF getPersonaleByCF,
            //IGetAlberaturaUnitaOperative getAlberaturaUnitaOperative,
            //IMemoryCache memoryCache
            //HttpClient client
            )
        {
            _getListaSquadre = getListaSquadre;
            _getMezziPrenotati = getMezziPrenotati;
            _getMezziUtilizzabili = getMezziUtilizzabili;
            _getStatoSquadre = getStatoSquadre;

            //_client = client;
            //_configuration = configuration;
            //_getDistaccamentoByCodiceSedeUC = getDistaccamentoByCodiceSedeUC;
            //_getPersonaleByCF = getPersonaleByCF;
            //_getAlberaturaUnitaOperative = getAlberaturaUnitaOperative;
            //_memoryCache = memoryCache;
        }

        public ComposizionePartenzaAvanzataResult Handle(ComposizionePartenzaAvanzataQuery query)
        {
            Log.Debug("Inizio elaborazione Composizione partenza avanzata Handler");

            var lstSedi = new List<string>() { query.CodiceSede };

            var lstSquadre = _getListaSquadre.Get(lstSedi).Result;
            var statiOperativi = _getStatoSquadre.Get(lstSedi);
            var lstMezzi = _getMezziUtilizzabili.Get(lstSedi).Result;

            #region MEZZI 

            var composizioneMezzi = GeneraListaComposizioneMezzi(lstMezzi);

            foreach (var composizione in composizioneMezzi)
            {
                //composizione.IndiceOrdinamento = _ordinamentoMezzi.GetIndiceOrdinamento(query.Filtro.IdRichiesta, composizione, composizione.Mezzo.CoordinateFake, composizione.Mezzo.IdRichiesta);
                composizione.Id = composizione.Mezzo.Codice;

                if (composizione.IstanteScadenzaSelezione < DateTime.Now)
                {
                    composizione.IstanteScadenzaSelezione = null;
                }
            }

            var composizioneMezziPrenotati = GetComposizioneMezziPrenotati(composizioneMezzi, query.CodiceSede);
            //Per i mezzi con coordinate Fake nella property  i Km  e la TempoPercorrenza vengono impostati i  valori medi della collection
            decimal totaleKM = 0;
            decimal totaleTempoPercorrenza = 0;

            foreach (var composizione in composizioneMezziPrenotati)
            {
                totaleKM = totaleKM + Convert.ToDecimal(composizione.Km.Replace(".", ","));
                totaleTempoPercorrenza = totaleTempoPercorrenza + Convert.ToDecimal(composizione.TempoPercorrenza.Replace(".", ","));
            }

            string mediaDistanza = Math.Round((totaleKM / composizioneMezzi.Count), 2).ToString(CultureInfo.InvariantCulture);
            string mediaTempoPercorrenza = Math.Round((totaleTempoPercorrenza / composizioneMezzi.Count), 2).ToString(CultureInfo.InvariantCulture);

            foreach (var composizione in composizioneMezziPrenotati)
            {
                if (composizione.Mezzo.CoordinateFake)
                {
                    composizione.Km = mediaDistanza;
                    composizione.TempoPercorrenza = mediaTempoPercorrenza;
                    //composizione.IndiceOrdinamento = _ordinamentoMezzi.GetIndiceOrdinamento(query.Filtro.IdRichiesta, composizione, composizione.Mezzo.CoordinateFake, composizione.Mezzo.IdRichiesta);
                    composizione.Km = null;
                    composizione.TempoPercorrenza = null;
                }
            }

            var mezziresult = composizioneMezziPrenotati.OrderByDescending(x => x.IndiceOrdinamento).ToList();

            #endregion

            #region SQUADRE

            var composizioneSquadre = new List<Classi.Composizione.ComposizioneSquadre>();

            foreach (Squadra s in lstSquadre)
            {
                if (statiOperativi.Exists(x => x.IdSquadra.Equals(s.Id)))
                {
                    s.Stato = MappaStatoSquadraDaStatoMezzo.MappaStato(statiOperativi.Find(x => x.IdSquadra.Equals(s.Id)).StatoSquadra);
                    s.IndiceOrdinamento = -200;
                }
                else
                {
                    s.Stato = Squadra.StatoSquadra.InSede;
                }

                var c = new Classi.Composizione.ComposizioneSquadre
                {
                    Squadra = s,
                    Id = s.Id
                };
                composizioneSquadre.Add(c);
            }

            var squadreresult = composizioneSquadre.OrderByDescending(x => x.Squadra.IndiceOrdinamento).ToList();

            #endregion

            var composizioneAvanzata = new Classi.Composizione.ComposizionePartenzaAvanzata()
            {
                ComposizioneMezziDataArray = mezziresult,
                ComposizioneSquadreDataArray = squadreresult,
                MezziPagination = query.Filtro.MezziPagination,
                SquadrePagination = query.Filtro.SquadrePagination
            };

            Log.Debug("Fine elaborazione Composizione partenza avanzata Handler");

            return new ComposizionePartenzaAvanzataResult()
            {
                ComposizionePartenzaAvanzata = composizioneAvanzata
            };
        }

        private List<Classi.Composizione.ComposizioneMezzi> GetComposizioneMezziPrenotati(List<Classi.Composizione.ComposizioneMezzi> composizioneMezzi, string codiceSede)
        {
            var mezziPrenotati = _getMezziPrenotati.Get(codiceSede);
            foreach (var composizione in composizioneMezzi)
            {
                if (mezziPrenotati.Find(x => x.CodiceMezzo.Equals(composizione.Mezzo.Codice)) != null)
                {
                    composizione.IstanteScadenzaSelezione = mezziPrenotati.Find(x => x.CodiceMezzo.Equals(composizione.Mezzo.Codice)).IstanteScadenzaSelezione;

                    if (composizione.Mezzo.Stato.Equals("In Sede"))
                    {
                        composizione.Mezzo.Stato = mezziPrenotati.Find(x => x.CodiceMezzo.Equals(composizione.Mezzo.Codice)).StatoOperativo;
                    }
                }
            }
            return composizioneMezzi;
        }

        private List<Classi.Composizione.ComposizioneMezzi> GeneraListaComposizioneMezzi(IEnumerable<Mezzo> listaMezzi)
        {
            var random = new Random();

            return (from mezzo in listaMezzi
                    let kmGen = random.Next(1, 60).ToString()
                    let tempoPer = Convert.ToDouble(kmGen.Replace(".", ",")) / 1.75
                    select new Classi.Composizione.ComposizioneMezzi()
                    {
                        Id = mezzo.Codice,
                        Mezzo = mezzo,
                        Km = kmGen,
                        TempoPercorrenza = Math.Round(tempoPer, 2).ToString(CultureInfo.InvariantCulture),
                    }).ToList();
        }




        //private async Task<List<Squadra>> getSquadre(List<string> sedi)
        //{
        //    List<Squadra> listaSquadre = new List<Squadra>();
        //    List<string> ListaCodiciSedi = new List<string>();
        //    foreach (string sede in sedi)
        //    {
        //        var codice = sede.Substring(0, 2);
        //        string codiceE = "";
        //        codiceE = ListaCodiciSedi.Find(x => x.Equals(codice));
        //        if (string.IsNullOrEmpty(codiceE))
        //        {
        //            ListaCodiciSedi.Add(codice);
        //        }
        //    }

        //    foreach (string CodSede in ListaCodiciSedi)
        //    {
        //        #region LEGGO DA API ESTERNA

        //        using (var _client = new HttpClient())
        //        {
        //            _client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("test");
        //            var response = await _client.GetAsync($"{_configuration.GetSection("OracleImplementation").GetSection(CodSede).GetSection("UrlAPISquadre").Value}/GetListaSquadre?CodSede={CodSede}").ConfigureAwait(false);
        //            response.EnsureSuccessStatusCode();
        //            using HttpContent content = response.Content;

        //            string data = await content.ReadAsStringAsync().ConfigureAwait(false);
        //            List<ORASquadre> ListaSquadreOracle = JsonConvert.DeserializeObject<List<ORASquadre>>(data);

        //            var lstPersonaleSquadre = GetListaPersonaleSquadre(_client);
        //            var ListaPersonaleSquadre = await lstPersonaleSquadre.Get(CodSede);
        //        }

        //        #endregion LEGGO DA API ESTERNA

        //        List<Squadra> listaSquadrePerSede = MapListaSquadreOraInMongoDB(ListaSquadreOracle, lstPersonaleSquadre, CodSede);

        //        foreach (Squadra s in listaSquadrePerSede)
        //        {
        //            listaSquadre.Add(s);
        //        }
        //    }

        //    return listaSquadre;
        //}

        //private List<Squadra> MapListaSquadreOraInMongoDB(List<ORASquadre> ListaSquadreOracle, List<ORAPersonaleSquadre> ListaPersonaleSquadre, string CodSede)
        //{
        //    List<Squadra> ListaSquadre = new List<Squadra>();
        //    List<ORAPersonaleSquadre> ListOraPS = new List<ORAPersonaleSquadre>();

        //    foreach (ORASquadre OraS in ListaSquadreOracle)
        //    {
        //        List<Distaccamento> distaccamenti = _getListaDistaccamentiByCodiceSede.GetListaDistaccamenti(CodSede);
        //        var distaccamentoCoordinate = distaccamenti.Find(x => x.CodDistaccamento.Equals(Decimal.ToInt32(OraS.COD_DISTACCAMENTO)));

        //        var distaccamento = new Distaccamento();
        //        distaccamento = _getDistaccamentoByCodiceSedeUC.Get(CodSede + "." + OraS.COD_DISTACCAMENTO.ToString()).Result;
        //        Sede sedeDistaccamento;
        //        if (distaccamento != null)
        //        {
        //            sedeDistaccamento = new Sede(CodSede.ToString() + "." + distaccamento.CodDistaccamento.ToString(), distaccamento.DescDistaccamento, distaccamento.Indirizzo, distaccamentoCoordinate.Coordinate, "", "", "", "", "");
        //            Squadra.StatoSquadra Stato;

        //            switch (OraS.STATO.ToString())
        //            {
        //                case "L": Stato = Squadra.StatoSquadra.InSede; break;
        //                case "A": Stato = Squadra.StatoSquadra.SulPosto; break;
        //                case "R": Stato = Squadra.StatoSquadra.InRientro; break;
        //                default: Stato = Squadra.StatoSquadra.InSede; break;
        //            }

        //            Stato = Squadra.StatoSquadra.InSede;

        //            List<Componente> ComponentiSquadra = new List<Componente>();
        //            List<string> ListaCodiciFiscaliComponentiSquadra = new List<string>();
        //            ListOraPS = ListaPersonaleSquadre.FindAll(x => x.COD_SQUADRA.Equals(OraS.COD_SQUADRA));
        //            if (ListOraPS.Count > 0)
        //            //if (!istOraPS.Any())
        //            {
        //                foreach (ORAPersonaleSquadre p in ListOraPS)
        //                {
        //                    PersonaleVVF pVVf = _getPersonaleByCF.Get(p.MATDIP, CodSede).Result;

        //                    bool capoPartenza = false; bool autista = false;
        //                    if (p.FLAG_CAPO_SQUADRA.Equals("S")) capoPartenza = true;
        //                    if (p.AUTISTA.Equals("S")) autista = true;
        //                    Componente c = new Componente(p.QUALIFICA_ABBREV, pVVf.Nominativo, pVVf.Nominativo, capoPartenza, autista, false)
        //                    {
        //                        CodiceFiscale = pVVf.CodFiscale,
        //                    };
        //                    if (p.ORA_INIZIO.HasValue) c.OrarioInizio = (DateTime)p.ORA_INIZIO;
        //                    if (p.ORA_FINE.HasValue) c.OrarioInizio = (DateTime)p.ORA_FINE;

        //                    ComponentiSquadra.Add(c);
        //                    ListaCodiciFiscaliComponentiSquadra.Add(p.MATDIP);
        //                }
        //            }
        //            Squadra squadra = new Squadra(OraS.SIGLA, Stato, ComponentiSquadra, sedeDistaccamento);
        //            squadra.Id = OraS.COD_SQUADRA.ToString();

        //            squadra.ListaCodiciFiscaliComponentiSquadra = ListaCodiciFiscaliComponentiSquadra;
        //            ListaSquadre.Add(squadra);
        //        }
        //        else
        //        {
        //            //Se il distaccamento è vuoto non viene aggiunta la squadra
        //        }
        //    }

        //    return ListaSquadre;
        //}

        //private async Task<List<ORAPersonaleSquadre>> GetListaPersonaleSquadre(HttpClient _client)
        //{
        //    _client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("test");
        //    var response = await _client.GetAsync($"{_configuration.GetSection("OracleImplementation").GetSection(CodSede).GetSection("UrlAPISquadre").Value}/GetListaPersonaleSquadre?CodSede={CodSede}").ConfigureAwait(false);
        //    response.EnsureSuccessStatusCode();
        //    using HttpContent content = response.Content;

        //    string data = await content.ReadAsStringAsync().ConfigureAwait(false);

        //    return JsonConvert.DeserializeObject<List<ORAPersonaleSquadre>>(data);
        //}
    }
}
