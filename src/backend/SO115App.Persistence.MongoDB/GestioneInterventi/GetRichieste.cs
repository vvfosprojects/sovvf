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
using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Servizi.CQRS.Mappers.RichiestaSuSintesi;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.RicercaRichiesteAssistenza;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Classi.RubricaDTO;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.GestioneRubrica.Enti;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using SO115App.Models.Servizi.Infrastruttura.Turni;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.Persistence.MongoDB
{
    public class GetRichiesta : IGetRichiesta, IGetListaSintesi, IGetSintesiRichiestaAssistenzaByCodice
    {
        private readonly DbContext _dbContext;
        private readonly IMapperRichiestaSuSintesi _mapperSintesi;
        private readonly IGetDistaccamentoByCodiceSedeUC _getDistaccamentoUC;
        private readonly IGetRubrica _getRubrica;
        private readonly IGetTurno _getTurno;

        public GetRichiesta(DbContext dbContext,
            IMapperRichiestaSuSintesi mapperSintesi,
            IGetDistaccamentoByCodiceSedeUC getDistaccamentoUC,
            IGetRubrica getRubrica, IGetTurno getTurno)
        {
            _dbContext = dbContext;
            _mapperSintesi = mapperSintesi;
            _getDistaccamentoUC = getDistaccamentoUC;
            _getRubrica = getRubrica;
            _getTurno = getTurno;
        }

        public RichiestaAssistenza GetByCodice(string codiceRichiesta)
        {
            return _dbContext.RichiestaAssistenzaCollection.Find(s => s.Codice == codiceRichiesta).FirstOrDefault();
        }

        public RichiestaAssistenza GetById(string idRichiesta)
        {
            return _dbContext.RichiestaAssistenzaCollection.Find(s => s.Id == idRichiesta).FirstOrDefault();
        }

        public RichiestaAssistenza GetByCodiceRichiesta(string CodRichiesta)
        {
            return _dbContext.RichiestaAssistenzaCollection.Find(s => s.CodRichiesta == CodRichiesta).FirstOrDefault();
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

            //FILTRO TIPOLOGIA RICHIESTA (CHIAMATE/INTERVENTI)
            if (filtro.TipologiaRichiesta != null) result = result.Where(r =>
            {
                if (filtro.TipologiaRichiesta.Equals("Chiamate"))
                    return r.TestoStatoRichiesta == "C";

                if (filtro.TipologiaRichiesta.Equals("Interventi"))
                    return r.TestoStatoRichiesta != "C";

                return true;
            }).ToList();

            //FILTRO STATI RICHIESTA
            if (filtro.StatiRichiesta != null && filtro.StatiRichiesta.Count() != 0)
            {
                if (filtro.StatiRichiesta.Contains("Assegnata"))
                    filtro.StatiRichiesta.Add("InAttesa");

                result = result.Where(r => filtro.StatiRichiesta.Contains(r.StatoRichiesta.GetType().Name)).ToList();
            }
            else if (filtro.SoloChiuse)
                result = result.Where(r => r.StatoRichiesta.GetType().Name.Contains("Chiusa")).ToList();
            else
                result = result.Where(r => !r.StatoRichiesta.GetType().Name.Contains("Chiusa")).ToList();

            //FILTRO ZONE EMERGENZA
            if (filtro.ZoneEmergenza != null)
                result = result.Where(r => r.CodZoneEmergenza.Any(z => filtro.ZoneEmergenza.Contains(z))).ToList();

            //FILTRO PERIODO CHIAMATE CHIUSE
            if (filtro.PeriodoChiuse != null) result = result.Where(r =>
            {
                if (filtro.PeriodoChiuse.Data != null)
                    return r.Aperta == true || (r.Chiusa == true && r.IstanteChiusura.Value.Year == filtro.PeriodoChiuse.Data.Value.Year && r.IstanteChiusura.Value.Month == filtro.PeriodoChiuse.Data.Value.Month && r.IstanteChiusura.Value.Day == filtro.PeriodoChiuse.Data.Value.Day);
                else if (filtro.PeriodoChiuse.Turno != null)
                {
                    var turno = _getTurno.Get(r.IstanteChiusura);

                    return r.Aperta == true || (r.Chiusa == true && turno.Codice.Contains(filtro.PeriodoChiuse.Turno));
                }
                else if (filtro.PeriodoChiuse.Da != null && filtro.PeriodoChiuse.A != null)
                    return r.Aperta == true || (r.IstanteChiusura >= filtro.PeriodoChiuse.Da && r.IstanteChiusura <= filtro.PeriodoChiuse.A);

                return true;
            }).ToList();

            if (filtro.FiltriTipologie != null)
            {
                result = result.Where(o => filtro.FiltriTipologie.Any(s => o.Tipologie.Contains(s))).ToList();
            }

            if (filtro.IndirizzoIntervento != null)
            {
                if (filtro.IndirizzoIntervento.Coordinate != null)
                    result = result.FindAll(o => o.Localita.Coordinate.Latitudine.Equals(filtro.IndirizzoIntervento.Coordinate.Latitudine) && o.Localita.Coordinate.Longitudine.Equals(filtro.IndirizzoIntervento.Coordinate.Longitudine));
                else if (filtro.IndirizzoIntervento.Indirizzo != null)
                    result = result.FindAll(o => o.Localita.Indirizzo.Contains(filtro.IndirizzoIntervento.Indirizzo));
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
                    .ThenByDescending(x => x.IstanteRicezioneRichiesta)
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
