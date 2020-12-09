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
using SO115App.Models.Classi.RubricaDTO;
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

            List<string> listaCodSedi = new List<string>();
            foreach (var sede in filtro.UnitaOperative)
            {
                listaCodSedi.Add(sede.Codice);
            }

            var filtriSediAllertate = Builders<RichiestaAssistenza>.Filter.AnyIn(x => x.CodSOAllertate, listaCodSedi);

            List<RichiestaAssistenza> result = new List<RichiestaAssistenza>();

            result = _dbContext.RichiestaAssistenzaCollection.Find(filtroSediCompetenti).ToList();

            if (filtro.StatiRichiesta != null && filtro.StatiRichiesta.Count() != 0)
            {
                if (filtro.StatiRichiesta.Contains("Chiamata"))
                    filtro.StatiRichiesta = filtro.StatiRichiesta.ToList().Select(f =>
                    {
                        if (f == "Chiamata")
                            return "InAttesa";
                        return f;
                    }).ToArray();

                result = result.Where(r => filtro.StatiRichiesta.Contains(r.StatoRichiesta.GetType().Name)).ToList();
            }

            if (filtro.FiltriTipologie != null)
            {
                result = result.Where(o => filtro.FiltriTipologie.Any(s => o.Tipologie.Contains(s))).ToList();
            }

            if (filtro.TipologiaRichiesta != null)
                result = result.Where(r =>
                {
                    if (filtro.TipologiaRichiesta.Contains("Chiamata"))
                        return r.TestoStatoRichiesta == "C";

                    if (filtro.TipologiaRichiesta.Contains("Intervento"))
                        return r.TestoStatoRichiesta != "C";

                    return true;
                }).ToList();

            if (filtro.IndirizzoIntervento != null)
            {
                result = result.FindAll(o => o.Localita.Coordinate.Latitudine.Equals(filtro.IndirizzoIntervento.Coordinate.Latitudine) && o.Localita.Coordinate.Longitudine.Equals(filtro.IndirizzoIntervento.Coordinate.Longitudine));
            }

            if (filtro.StatiRichiesta != null && filtro.StatiRichiesta.Count() > 0)
                result = result.Where(r => filtro.StatiRichiesta.Contains(r.StatoRichiesta.GetType().Name)).ToList();

            var listaSistesiRichieste = new List<SintesiRichiesta>();

            foreach (RichiestaAssistenza richiesta in result)
            {
                List<EnteDTO> rubrica = new List<EnteDTO>();
                if (richiesta.CodEntiIntervenuti != null)
                {
                    var lstCodiciEnti = richiesta.CodEntiIntervenuti.Select(c => int.Parse(c)).ToArray();

                    rubrica = _getRubrica.GetBylstCodici(lstCodiciEnti);
                }

                SintesiRichiesta sintesi = new SintesiRichiesta();

                if (richiesta.CodUOCompetenza != null)
                {
                    sintesi = _mapperSintesi.Map(richiesta);
                    sintesi.Competenze = MapCompetenze(richiesta.CodUOCompetenza);
                    sintesi.SediAllertate = richiesta.CodSOAllertate != null ? MapCompetenze(richiesta.CodSOAllertate.ToArray()) : null;
                    sintesi.ListaEntiIntervenuti = rubrica.Count == 0 ? null : rubrica;
                    listaSistesiRichieste.Add(sintesi);
                }
            }

            //ORDINAMENTO RICHIESTE
            return listaSistesiRichieste
                    .OrderByDescending(c => c.Stato.Equals(Costanti.Chiamata) && c.Partenze.Count == 0)
                    .ThenByDescending(c => c.Stato.Equals(Costanti.Chiamata) && c.Partenze.Count > 0)
                    .ThenByDescending(c => c.Stato.Equals(Costanti.RichiestaAssegnata))
                    .ThenByDescending(c => c.Stato.Equals(Costanti.RichiestaPresidiata))
                    .ThenByDescending(c => c.Stato.Equals(Costanti.RichiestaChiusa))
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

                    if (sede != null)
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

            var rubrica = new List<EnteDTO>();
            if (richiesta.CodEntiIntervenuti != null)
                rubrica = _getRubrica.GetBylstCodici(richiesta.CodEntiIntervenuti.Select(c => int.Parse(c)).ToArray());

            if (richiesta.CodUOCompetenza != null)
            {
                sintesi = _mapperSintesi.Map(richiesta);
                sintesi.ListaEntiIntervenuti = rubrica.Count > 0 ? rubrica?.FindAll(c => richiesta.CodEntiIntervenuti?.Contains(c.Codice.ToString()) ?? false) : null;
                sintesi.Competenze = MapCompetenze(richiesta.CodUOCompetenza);
                sintesi.SediAllertate = richiesta.CodSOAllertate != null ? MapCompetenze(richiesta.CodSOAllertate.ToArray()) : null;
            }

            return sintesi;
        }
    }
}
