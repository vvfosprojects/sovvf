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
using MongoDB.Bson;
using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Classi.Soccorso.Eventi.Fonogramma;
using SO115App.API.Models.Servizi.CQRS.Mappers.RichiestaSuSintesi;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.RicercaRichiesteAssistenza;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Classi.Filtri;
using SO115App.Models.Classi.RubricaDTO;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.GestioneRubrica.Enti;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using SO115App.Models.Servizi.Infrastruttura.Turni;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.Persistence.MongoDB
{
    public class GetRichiesta : IGetRichiesta, IGetListaSintesi, IGetSintesiRichiestaAssistenzaByCodice, IGetRiepilogoInterventi
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

            var lstRichieste = new List<RichiestaAssistenza>();
            if (filtro.SearchKey == null || filtro.SearchKey.Length == 0)
            {
                lstRichieste = _dbContext.RichiestaAssistenzaCollection.Find(filtroSediCompetenti | filtriSediAllertate).ToList();
            }
            else
            {

                var filtroFullText = Builders<RichiestaAssistenza>.Filter.AnyEq("descrizione", new BsonRegularExpression($".*{filtro.SearchKey}.*"));
                filtroFullText |= Builders<RichiestaAssistenza>.Filter.AnyEq("localita.indirizzo", new BsonRegularExpression($".*{filtro.SearchKey}.*"));
                filtroFullText |= Builders<RichiestaAssistenza>.Filter.AnyEq("localita.citta", new BsonRegularExpression($".*{filtro.SearchKey}.*"));
                filtroFullText |= Builders<RichiestaAssistenza>.Filter.AnyEq("localita.provincia", new BsonRegularExpression($".*{filtro.SearchKey}.*"));
                filtroFullText |= Builders<RichiestaAssistenza>.Filter.AnyEq("codRichiesta", new BsonRegularExpression($".*{filtro.SearchKey}.*"));
                filtroFullText |= Builders<RichiestaAssistenza>.Filter.AnyEq("codice", new BsonRegularExpression($".*{filtro.SearchKey}.*"));
                filtroFullText |= Builders<RichiestaAssistenza>.Filter.AnyEq("tags", new BsonRegularExpression($".*{filtro.SearchKey}.*"));
                filtroFullText |= Builders<RichiestaAssistenza>.Filter.AnyEq("codSoCompetente", new BsonRegularExpression($".*{filtro.SearchKey}.*"));
                filtroFullText |= Builders<RichiestaAssistenza>.Filter.AnyEq("richiedente.telefono", new BsonRegularExpression($".*{filtro.SearchKey}.*"));
                filtroFullText |= Builders<RichiestaAssistenza>.Filter.AnyEq("richiedente.nominativo", new BsonRegularExpression($".*{filtro.SearchKey}.*"));
                filtroFullText |= Builders<RichiestaAssistenza>.Filter.AnyEq("noteNue", new BsonRegularExpression($".*{filtro.SearchKey}.*"));
                filtroFullText |= Builders<RichiestaAssistenza>.Filter.AnyEq("notePubbliche", new BsonRegularExpression($".*{filtro.SearchKey}.*"));
                filtroFullText |= Builders<RichiestaAssistenza>.Filter.AnyEq("notePrivate", new BsonRegularExpression($".*{filtro.SearchKey}.*"));
                filtroFullText |= Builders<RichiestaAssistenza>.Filter.AnyEq("listaEventi.codiceMezzo", new BsonRegularExpression($".*{filtro.SearchKey}.*"));
                filtroFullText |= Builders<RichiestaAssistenza>.Filter.AnyEq("listaEventi.partenza.squadre.nome", new BsonRegularExpression($".*{filtro.SearchKey}.*"));

                var indexWildcardTextSearch = new CreateIndexModel<RichiestaAssistenza>(Builders<RichiestaAssistenza>.IndexKeys.Text("$**"));

                List<CreateIndexModel<RichiestaAssistenza>> indexes = new List<CreateIndexModel<RichiestaAssistenza>>();
                indexes.Add(indexWildcardTextSearch);

                _dbContext.RichiestaAssistenzaCollection.Indexes.CreateMany(indexes);
                lstRichieste = _dbContext.RichiestaAssistenzaCollection.Find(filtroFullText & (filtroSediCompetenti | filtriSediAllertate)).ToList();
            }

            if (filtro == null)
                return lstRichieste.Select(r => _mapperSintesi.Map(r)).ToList();

            var result = new List<RichiestaAssistenza>();

            //FILTRO TIPOLOGIA RICHIESTA (CHIAMATE/INTERVENTI)
            if (filtro.TipologiaRichiesta != null)
            {
                result = lstRichieste.Where(r =>
                {
                    if (filtro.TipologiaRichiesta.Equals("Chiamate"))
                        return r.CodRichiesta == null && r.TestoStatoRichiesta != "X";

                    if (filtro.TipologiaRichiesta.Equals("Interventi"))
                        return r.CodRichiesta != null && r.TestoStatoRichiesta != "X";

                    if (filtro.TipologiaRichiesta.Equals("ChiamateInterventi") || filtro.TipologiaRichiesta.Equals("InterventiChiamate"))
                        return r.TestoStatoRichiesta != "X";

                    return true;
                }).ToList();
            }
            else
            {
                if (filtro.Chiuse == null)
                    result = lstRichieste.Where(r => r.TestoStatoRichiesta != "X").ToList();
                else
                    result = lstRichieste.ToList();
            }

            //FILTRO STATI RICHIESTA
            if (filtro.StatiRichiesta != null && filtro.StatiRichiesta.Count() != 0)
            {
                result = result.Where(r => filtro.StatiRichiesta.Contains(r.StatoRichiesta.GetType().Name)).ToList();
            }

            //FILTRO ZONE EMERGENZA
            if (filtro.ZoneEmergenza != null)
                result = result.Where(r => r.CodZoneEmergenza.Any(z => filtro.ZoneEmergenza.Contains(z))).ToList();

            //FILTRO PERIODO CHIAMATE CHIUSE
            if (filtro.PeriodoChiuseChiamate != null) result = result.Where(r => r.Chiusa && r.CodRichiesta == null).Where(r =>
            {
                if (filtro.PeriodoChiuseChiamate.Data != null)
                    return r.IstanteChiusura.Value.Year == filtro.PeriodoChiuseChiamate.Data.Value.Year && r.IstanteChiusura.Value.Month == filtro.PeriodoChiuseChiamate.Data.Value.Month && r.IstanteChiusura.Value.Day == filtro.PeriodoChiuseChiamate.Data.Value.Day;
                else if (filtro.PeriodoChiuseChiamate.Turno != null)
                    return _getTurno.Get(r.IstanteChiusura).Codice.Contains(filtro.PeriodoChiuseChiamate.Turno);
                else if (filtro.PeriodoChiuseChiamate.Da != null && filtro.PeriodoChiuseChiamate.A != null)
                    return r.IstanteChiusura >= filtro.PeriodoChiuseChiamate.Da && r.IstanteChiusura <= filtro.PeriodoChiuseChiamate.A;

                return true;
            }).ToList();
            else if (filtro.Chiuse?.Count() > 0)
            {
                if (filtro.Chiuse.Contains("Chiamate chiuse"))
                {
                    if (filtro.SoloboxRichieste)
                        result.AddRange(lstRichieste.Where(r => r.Chiusa && r.CodRichiesta == null));
                    else
                    {
                        if (filtro.TipologiaRichiesta == null)
                            result = lstRichieste.Where(r => r.Chiusa && r.CodRichiesta == null).ToList();
                        else
                            result.AddRange(lstRichieste.Where(r => r.Chiusa && r.CodRichiesta == null));
                    }
                }
            }

            //FILTRO PERIODO INTERVENTI CHIUSE
            if (filtro.PeriodoChiusiInterventi != null) result = result.Where(r => r.Chiusa && r.CodRichiesta != null).Where(r =>
            {
                if (filtro.PeriodoChiusiInterventi.Data != null)
                    return r.CodRichiesta != null && r.IstanteChiusura.Value.Year == filtro.PeriodoChiusiInterventi.Data.Value.Year && r.IstanteChiusura.Value.Month == filtro.PeriodoChiusiInterventi.Data.Value.Month && r.IstanteChiusura.Value.Day == filtro.PeriodoChiusiInterventi.Data.Value.Day;
                else if (filtro.PeriodoChiusiInterventi.Turno != null)
                    return _getTurno.Get(r.IstanteChiusura).Codice.Contains(filtro.PeriodoChiusiInterventi.Turno);
                else if (filtro.PeriodoChiusiInterventi.Da != null && filtro.PeriodoChiusiInterventi.A != null)
                    return r.IstanteChiusura >= filtro.PeriodoChiusiInterventi.Da && r.IstanteChiusura <= filtro.PeriodoChiusiInterventi.A;

                return true;
            }).ToList();
            else if (filtro.Chiuse?.Count() > 0)
            {
                if (filtro.Chiuse.Contains("Interventi chiusi"))
                {
                    if (filtro.SoloboxRichieste)

                        result.AddRange(lstRichieste.Where(r => r.Chiusa && r.CodRichiesta != null));
                    else
                    {
                        if (filtro.TipologiaRichiesta == null)
                            result = lstRichieste.Where(r => r.Chiusa && r.CodRichiesta != null).ToList();
                        else
                            result.AddRange(lstRichieste.Where(r => r.Chiusa && r.CodRichiesta != null));
                    }
                }
            }

            if (filtro.FiltriTipologie != null)
                result.AddRange(lstRichieste.Where(o => filtro.FiltriTipologie.Any(s => o.Tipologie.Contains(s))));

            if (filtro.IndirizzoIntervento != null)
            {
                if (filtro.IndirizzoIntervento.Coordinate != null)
                    result.AddRange(lstRichieste.Where(o => o.Localita.Coordinate.Latitudine.Equals(filtro.IndirizzoIntervento.Coordinate.Latitudine) && o.Localita.Coordinate.Longitudine.Equals(filtro.IndirizzoIntervento.Coordinate.Longitudine)));
                else if (filtro.IndirizzoIntervento.Indirizzo != null)
                {
                    if (filtro.SoloChiuse)
                        result = lstRichieste.Where(o => o.Localita.Indirizzo.Contains(filtro.IndirizzoIntervento.Indirizzo) && o.Chiusa).ToList();
                }
            }

            //MAPPING
            var listaSistesiRichieste = result.Where(richiesta => richiesta.CodUOCompetenza != null).Select(richiesta =>
            {
                var rubrica = new List<EnteDTO>();
                var sintesi = new SintesiRichiesta();
                sintesi = _mapperSintesi.Map(richiesta);
                sintesi.Competenze = MapCompetenze(richiesta.CodUOCompetenza);
                sintesi.SediAllertate = richiesta.CodSOAllertate != null ? MapCompetenze(richiesta.CodSOAllertate.ToArray()) : null;
                return sintesi;
            });

            //ORDINAMENTO RICHIESTE
            return listaSistesiRichieste
                .Distinct()
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
                    Sede sede = Distaccamento == null ? null : new Sede(codCompetenza, Distaccamento.DescDistaccamento, Distaccamento.Indirizzo, Distaccamento.Coordinate);

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
                rubrica = _getRubrica.GetBylstCodici(richiesta.CodEntiIntervenuti.Select(c => c).ToArray());

            if (richiesta.CodUOCompetenza != null)
            {
                sintesi = _mapperSintesi.Map(richiesta);
                //sintesi.CodEntiIntervenuti = rubrica.Count > 0 ? rubrica?.FindAll(c => richiesta.CodEntiIntervenuti?.Contains(c.Codice.ToString()) ?? false) : null;
                sintesi.Competenze = MapCompetenze(richiesta.CodUOCompetenza);
                sintesi.SediAllertate = richiesta.CodSOAllertate != null ? MapCompetenze(richiesta.CodSOAllertate.ToArray()) : null;
            }

            return sintesi;
        }

        public async Task<List<RichiestaAssistenza>> GetRiepilogoInterventi(FiltriRiepilogoInterventi filtri)
        {
            //FILTRO I CAMPI CHE ABBIAMO SALVATI SUL DB

            var empty = Builders<RichiestaAssistenza>.Filter.Empty;

            var soloInterventi = filtri?.AltriFiltri?.SoloInterventi == false ? Builders<RichiestaAssistenza>.Filter.Ne(r => r.TestoStatoRichiesta, "C") : empty; //OK

            var distaccamento = string.IsNullOrEmpty(filtri.Distaccamento) ? empty : Builders<RichiestaAssistenza>.Filter.Eq(r => r.CodSOCompetente, filtri.Distaccamento); //OK

            var turno = string.IsNullOrEmpty(filtri.Turno) ? empty : Builders<RichiestaAssistenza>.Filter.Eq(r => r.TrnInsChiamata, filtri.Turno); //OK

            var lstsq = new List<string> { filtri.Squadra };
            var squadre = string.IsNullOrEmpty(filtri.Squadra) ? empty : Builders<RichiestaAssistenza>.Filter.AnyIn(r => r.lstSquadre, lstsq);

            var result = _dbContext.RichiestaAssistenzaCollection.Find(soloInterventi & distaccamento & turno & squadre).ToList();

            //FILTRO I CAMBI CALCOLATI DAL MODELLO IN GET (NON PRESENTI SUL DB)

            if (filtri.AltriFiltri?.Trasmessi ?? false)
                result = result.Where(r => r.ListaEventi.OfType<FonogrammaInviato>().Count() > 0).ToList();

            result = result.Where(r => filtri.Da <= r.dataOraInserimento && filtri.A >= r.dataOraInserimento).ToList();

            return result;
        }
    }
}
