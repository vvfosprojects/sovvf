//-----------------------------------------------------------------------
// <copyright file="GetRichieste.cs" company="CNVVF">
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
using AutoMapper;
using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Classi.Soccorso.StatiRichiesta;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.RicercaRichiesteAssistenza;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.CustomMapper;
using SO115App.Models.Servizi.Infrastruttura.GestioneRubrica.Enti;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.GestioneTipologie;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti.CoordinateTask;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata.Ecma335;

namespace SO115App.Persistence.MongoDB
{
    public class GetRichiesta : IGetRichiestaById, IGetListaSintesi, IGetSintesiRichiestaAssistenzaByCodice
    {
        private readonly DbContext _dbContext;
        private readonly IMapper _mapper;
        private readonly IGetTipologieByCodice _getTipologiaByCodice;
        private readonly IGetListaDistaccamentiByCodiceSede _getAnagraficaDistaccamento;
        private readonly MapperRichiestaAssistenzaSuSintesi _mapperSintesi;
        private readonly IGetAlberaturaUnitaOperative _getAlberaturaUnitaOperative;
        private readonly IGetDistaccamentoByCodiceSedeUC _getDistaccamentoUC;
        private readonly IGetCoordinateDistaccamento _getCooDistaccamento; //TODO chiedere ad Igor di implementare le coordinate
        private readonly IGetRubrica _getRubrica;

        public GetRichiesta(DbContext dbContext, IMapper mapper, IGetTipologieByCodice getTipologiaByCodice, IGetListaDistaccamentiByCodiceSede getAnagraficaDistaccamento,
            MapperRichiestaAssistenzaSuSintesi mapperSintesi, IGetAlberaturaUnitaOperative getAlberaturaUnitaOperative,
            IGetCoordinateDistaccamento getCooDistaccamento, IGetDistaccamentoByCodiceSedeUC getDistaccamentoUC, IGetRubrica getRubrica)
        {
            _dbContext = dbContext;
            _mapper = mapper;
            _getTipologiaByCodice = getTipologiaByCodice;
            _getAnagraficaDistaccamento = getAnagraficaDistaccamento;
            _mapperSintesi = mapperSintesi;
            _getAlberaturaUnitaOperative = getAlberaturaUnitaOperative;
            _getCooDistaccamento = getCooDistaccamento;
            _getDistaccamentoUC = getDistaccamentoUC;
            _getRubrica = getRubrica;
        }

        public RichiestaAssistenza GetByCodice(string codiceRichiesta)
        {
            try
            {
                var richiesta = _dbContext.RichiestaAssistenzaCollection
                    .Find(s => s.Codice == codiceRichiesta)
                    .Single();

                //richiesta.ent

                return richiesta;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public RichiestaAssistenza GetById(string idRichiesta)
        {
            return _dbContext.RichiestaAssistenzaCollection.Find(s => s.Id == idRichiesta).Single();
        }

        public RichiestaAssistenza GetByCodiceRichiesta(string CodRichiesta)
        {
            return _dbContext.RichiestaAssistenzaCollection.Find(s => s.CodRichiesta == CodRichiesta).Single();
        }

        public List<string> GetListaCodiciSintesiRichiesta(string[] CodSoCompetente)
        {
            var filtroRichiesteAperte = Builders<RichiestaAssistenza>.Filter.Ne(r => r.TestoStatoRichiesta, "X");

            var filtroSediCompetenti = Builders<RichiestaAssistenza>.Filter
                .In(richiesta => richiesta.CodSOCompetente, CodSoCompetente.Select(uo => uo));

            var listaRichieste = _dbContext.RichiestaAssistenzaCollection.Find(filtroSediCompetenti & filtroRichiesteAperte).ToList();

            List<string> listaCodiciRichieste = new List<string>();

            foreach (var richiesta in listaRichieste)
            {
                if (richiesta.CodRichiesta != null)
                    listaCodiciRichieste.Add(richiesta.CodRichiesta);
                else
                    listaCodiciRichieste.Add(richiesta.Codice);
            }

            return listaCodiciRichieste;
        }

        public List<SintesiRichiesta> GetListaSintesiRichieste(FiltroRicercaRichiesteAssistenza filtro)
        {
            var filtroSediCompetenti = Builders<RichiestaAssistenza>.Filter
                .In(richiesta => richiesta.CodSOCompetente, filtro.UnitaOperative.Select(uo => uo.Codice));

            var filtriSediAllertate = filtro.UnitaOperative.Select(uo =>
                Builders<RichiestaAssistenza>.Filter
                    .ElemMatch(richiesta => richiesta.CodSOAllertate, x => x == uo.Codice)
            );

            FilterDefinition<RichiestaAssistenza> orFiltroSediAllertate = Builders<RichiestaAssistenza>.Filter.Empty;
            foreach (var f in filtriSediAllertate)
                orFiltroSediAllertate |= f;

            List<RichiestaAssistenza> result = new List<RichiestaAssistenza>();
            //Iniziamo col restituire le richieste aperte.
            if (filtro.IncludiRichiesteAperte)
            {
                var filtroRichiesteAperte = Builders<RichiestaAssistenza>.Filter.Ne(r => r.TestoStatoRichiesta, "X");
                var filtroComplessivo = filtroSediCompetenti & filtroRichiesteAperte;

                var richiesteAperte = _dbContext.RichiestaAssistenzaCollection
                                        .Find(filtroComplessivo)
                                        .ToList();

                // qui l'ordinamento
                var richiestePerStato = richiesteAperte.GroupBy(r => r.TestoStatoRichiesta == InAttesa.SelettoreDB)
                    .ToDictionary(g => g.Key, g => g);

                /*
                 * true -> c1, c2, c3
                 * false -> r5, r8, r19, r34
                 */

                if (richiestePerStato.ContainsKey(false))
                    result.AddRange(
                        richiestePerStato[false]
                        .OrderBy(r => r.PrioritaRichiesta)
                        .ThenBy(r => r.IstanteRicezioneRichiesta));

                if (richiestePerStato.ContainsKey(true))
                    result.AddRange(
                        richiestePerStato[true]
                        .OrderBy(r => r.PrioritaRichiesta)
                        .ThenBy(r => r.IstanteRicezioneRichiesta));

                // qui la paginazione var resultPaginato = result.Skip().Take();

                // se abbiamo già raggiunto il numero di richieste desiderate, restituiamo e finisce
                // qua return resultPaginato;

                result.ToList();
            }

            if (filtro.IncludiRichiesteChiuse)
            {
                var filtroRichiesteChiuse = Builders<RichiestaAssistenza>.Filter.Eq(r => r.TestoStatoRichiesta, "X");
                var filtroComplessivo = filtroSediCompetenti & filtroRichiesteChiuse;

                var numeroRichiesteDaRecuperare = 20; //filtro.PageSize - (result.Count - filtro.PageSize);

                //if (numeroRichiesteDaRecuperare > 0)
                //{
                var closedToSkip = (filtro.Page - 1) * filtro.PageSize - result.Count;
                if (closedToSkip < 0)
                    closedToSkip = 0;
                var richiesteChiuse = _dbContext.RichiestaAssistenzaCollection.Find(filtroComplessivo)
                    .Skip(closedToSkip)
                    .Limit(numeroRichiesteDaRecuperare)
                    .ToList();

                result.AddRange(richiesteChiuse);
                //}
            }

            if (filtro.FiltriTipologie != null)
            {
                result = result.Where(o => filtro.FiltriTipologie.Any(s => o.Tipologie.Contains(s))).ToList();
            }

            if (filtro.IndirizzoIntervento != null)
            {
                result = result.FindAll(o => o.Localita.Coordinate.Latitudine.Equals(filtro.IndirizzoIntervento.Coordinate.Latitudine) && o.Localita.Coordinate.Longitudine.Equals(filtro.IndirizzoIntervento.Coordinate.Longitudine));
            }

            var listaSistesiRichieste = new List<SintesiRichiesta>();

            foreach (RichiestaAssistenza richiesta in result)
            {
                var lstCodiciEnti = richiesta.CodEntiIntervenuti.Select(c => int.Parse(c)).ToArray();

                var rubrica = _getRubrica.GetBylstCodici(lstCodiciEnti);

                SintesiRichiesta sintesi = new SintesiRichiesta();

                if (richiesta.CodUOCompetenza != null)
                {
                    sintesi = _mapperSintesi.Map(richiesta);
                    sintesi.Competenze = MapCompetenze(richiesta.CodUOCompetenza);
                    sintesi.ListaEntiIntervenuti = rubrica;
                    listaSistesiRichieste.Add(sintesi);
                }
            }

            return listaSistesiRichieste
                    .OrderByDescending(x => x.Stato == Costanti.Chiamata)
                    .ThenByDescending(x => x.Chiusa == false)
                    .ThenByDescending(x => x.PrioritaRichiesta)
                    .ThenBy(x => x.IstanteRicezioneRichiesta)
                    .ToList();
        }

        private List<Sede> MapCompetenze(string[] codUOCompetenza)
        {
            var listaSedi = new List<Sede>();
            int i = 1;
            foreach (var codCompetenza in codUOCompetenza)
            {
                if (i <= 3)
                {
                    var Distaccamento = _getDistaccamentoUC.Get(codCompetenza).Result;
                    Sede sede = Distaccamento == null ? null : new Sede(codCompetenza, Distaccamento.DescDistaccamento, Distaccamento.Indirizzo, Distaccamento.Coordinate, "", "", "", "", "");
                    listaSedi.Add(sede);
                }

                i++;
            }

            return listaSedi;
        }

        public SintesiRichiesta GetSintesi(string codiceRichiesta)
        {
            var richiesta = GetByCodice(codiceRichiesta);
            var sintesi = new SintesiRichiesta();

            var rubrica = _getRubrica.GetBylstCodici(richiesta.CodEntiIntervenuti.Select(c => int.Parse(c)).ToArray());

            if (richiesta.CodUOCompetenza != null)
            {
                sintesi = _mapperSintesi.Map(richiesta);
                sintesi.ListaEntiIntervenuti = rubrica?.FindAll(c => richiesta.CodEntiIntervenuti?.Contains(c.Codice.ToString()) ?? false);
                sintesi.Competenze = MapCompetenze(richiesta.CodUOCompetenza);
            }

            return sintesi;
        }
    }
}
