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
using Serilog;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Organigramma;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Classi.Utenti;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.PreAccoppiati;
using SO115App.Models.Classi.Composizione;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Classi.Filtri;
using SO115App.Models.Classi.Utenti.Autenticazione;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.GestioneTipologie;
using SO115App.Models.Servizi.Infrastruttura.GestioneStatoOperativoSquadra;
using SO115App.Models.Servizi.Infrastruttura.GetPreAccoppiati;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Gac;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.OPService;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Personale;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using SO115App.Models.Servizi.Infrastruttura.Turni;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.ComposizionePartenzaAvanzata
{
    public class ComposizionePartenzaAvanzataQueryHandler : IQueryHandler<ComposizionePartenzaAvanzataQuery, ComposizionePartenzaAvanzataResult>
    {
        #region Servizi

        private readonly IGetSquadre _getSquadre;
        private readonly IGetMezziUtilizzabili _getMezziUtilizzabili;
        private readonly IGetStatoSquadra _getStatoSquadre;
        private readonly IGetStatoMezzi _getMezziPrenotati;
        //private readonly IGetPreAccoppiati _getPreAccoppiati;
        private readonly IGetPersonaleByCF _getPersonaleByCF;

        private readonly IGetTipologieByCodice _getTipologieByCodice;
        private readonly IGetTurno _getTurno;
        private readonly IGetAlberaturaUnitaOperative _getAlberaturaUnitaOperative;
        private readonly IGetListaDistaccamentiByPinListaSedi _getDistaccamenti;

        #endregion Servizi

        public ComposizionePartenzaAvanzataQueryHandler(
            IGetPersonaleByCF getPersonaleByCF,
            IGetSquadre getSquadre,
            IGetStatoSquadra getStatoSquadre,
            IGetStatoMezzi getMezziPrenotati,
            IGetMezziUtilizzabili getMezziUtilizzabili,
            //IGetPreAccoppiati getPreAccoppiati,

            IGetTipologieByCodice getTipologieByCodice,
            IGetTurno getTurno,
            IGetAlberaturaUnitaOperative getAlberaturaUnitaOperative,
            IGetListaDistaccamentiByPinListaSedi getDistaccamenti)
        {
            _getPersonaleByCF = getPersonaleByCF;
            _getSquadre = getSquadre;
            _getMezziPrenotati = getMezziPrenotati;
            _getMezziUtilizzabili = getMezziUtilizzabili;
            _getStatoSquadre = getStatoSquadre;
            //_getPreAccoppiati = getPreAccoppiati;
            _getTipologieByCodice = getTipologieByCodice;
            _getTurno = getTurno;
            _getAlberaturaUnitaOperative = getAlberaturaUnitaOperative;
            _getDistaccamenti = getDistaccamenti;
        }

        public ComposizionePartenzaAvanzataResult Handle(ComposizionePartenzaAvanzataQuery query)
        {
            Log.Debug("Inizio elaborazione Composizione partenza avanzata Handler");

            DateTime adesso = DateTime.Now;

            //Prendo tutte le sedi al disotto della sede indicata nel filtro

            var listaSediAlberate = _getAlberaturaUnitaOperative.ListaSediAlberata();
            var pinNodi = new List<PinNodo>();
            var pinNodiNoDistaccamenti = new List<PinNodo>();

            foreach (var sede in query.CodiceSede)
            {
                pinNodi.Add(new PinNodo(sede, true));
                pinNodiNoDistaccamenti.Add(new PinNodo(sede, true));
            }

            foreach (var figlio in listaSediAlberate.GetSottoAlbero(pinNodi))
                pinNodi.Add(new PinNodo(figlio.Codice, true));

            //PREPARO I DATI CHE MI SERVONO
            List<Distaccamento> lstSedi = null;
            if (query.CodiceSede[0].Equals("CON"))
                lstSedi = _getDistaccamenti.GetListaDistaccamenti(pinNodi.ToHashSet().ToList());
            else
                lstSedi = _getDistaccamenti.GetListaDistaccamenti(pinNodiNoDistaccamenti);

            var tipologia90 = _getTipologieByCodice.Get(new List<string> { "90" }).First();

            var turnoCorrente = _getTurno.Get();
            var turnoPrecedente = _getTurno.Get(turnoCorrente.DataOraInizio.AddMilliseconds(-1));
            var turnoSuccessivo = _getTurno.Get(turnoCorrente.DataOraFine.AddMinutes(1));

            var statiOperativiMezzi = _getMezziPrenotati.Get(query.CodiceSede);
            var statiOperativiSquadre = _getStatoSquadre.Get(query.CodiceSede.ToList());

            ConcurrentDictionary<string, string> lstPreaccoppiati = null;
            var lstPersonale = new ConcurrentBag<PersonaleVVF>();

            var lstSquadreComposizione = Task.Factory.StartNew(() =>
            {
                var lstSquadre = new ConcurrentBag<SO115App.Models.Classi.ServiziEsterni.OPService.Squadra>();
                Parallel.ForEach(query.CodiceSede, async codice => _getSquadre.GetByCodiceDistaccamento(codice.Split('.')[0]).Result.ForEach(async squadra =>
                {
                    lstSquadre.Add(squadra);
                    squadra.Membri.ToList().ForEach(async m => lstPersonale.Add(_getPersonaleByCF.Get(m.CodiceFiscale).Result));
                    squadra.CodiciMezziPreaccoppiati?.ToList().ForEach(c => lstPreaccoppiati.TryAdd(squadra.Codice, c));
                }));

                return lstSquadre;
            })
            //MAPPING
            .ContinueWith(squadre => squadre.Result.Select(squadra => new Classi.Composizione.ComposizioneSquadre()
            {
                Id = squadra.Id,
                Squadra = new Squadra()
                {
                    Id = squadra.Id,
                    Stato = MappaStatoSquadraDaStatoMezzo.MappaStato(statiOperativiSquadre.Find(x => x.IdSquadra.Equals(squadra.Codice))?.StatoSquadra ?? Costanti.MezzoInSede),
                    PreAccoppiato = squadra.CodiciMezziPreaccoppiati?.Count() > 0,
                    Codice = squadra.Codice,
                    ListaCodiciFiscaliComponentiSquadra = squadra.Membri.Select(m => m.CodiceFiscale).ToList(),
                    Turno = squadra.TurnoAttuale,
                    Nome = squadra.Descrizione,
                    Distaccamento = lstSedi.Select(s => new Sede(s.CodSede, s.DescDistaccamento, s.Indirizzo, s.Coordinate, "", "", "", "", "")).FirstOrDefault(s => s.Equals(squadra.Distaccamento)),
                    DataInServizio = squadra.Membri.Min(m => m.Presenze.Min(p => p.Da)),
                    IstanteTermineImpegno = squadra.Membri.Max(m => m.Presenze.Max(p => p.A)),
                    //IndiceOrdinamento = GetIndiceOrdinamento(s, query.Richiesta),
                    Componenti = lstPersonale.Where(p => squadra.Membri.Select(m => m.CodiceFiscale).Contains(p.codiceFiscale))
                        .Select(p => new Componente(p.qualifica.descrizione, $"{p.nome} {p.cognome}", "", false, false, false)).Distinct().ToList()
                },
                //MezzoPreaccoppiato = lstPreaccoppiati.FirstOrDefault(p => p.SquadreComposizione.Select(ss => ss.Id).Contains(squadra.Id))?.MezzoComposizione
            }))
            //FILTRI E ORDINAMENTI
            .ContinueWith(lstCompSquadre => FiltraOrdina(query, lstCompSquadre.Result, tipologia90, turnoCorrente, turnoPrecedente, turnoSuccessivo));


            var lstMezziComposizione = _getMezziUtilizzabili.Get(query.CodiceSede.ToList())
            //MAPPING
            .ContinueWith(lstMezzi => lstMezzi.Result.Select(m =>
            {
                //m.PreAccoppiato = lstPreaccoppiati.FirstOrDefault(p => p.MezzoComposizione.Mezzo.Codice == m.Codice)?.MezzoComposizione.Mezzo.PreAccoppiato ?? false;

                var mc = new Classi.Composizione.ComposizioneMezzi()
                {
                    Id = m.Codice,
                    Mezzo = m,
                    Km = new Random().Next(1, 60).ToString(),
                    TempoPercorrenza = Math.Round(Convert.ToDouble(new Random().Next(1, 60).ToString().Replace(".", ",")) / 1.75, 2).ToString(CultureInfo.InvariantCulture),
                    //SquadrePreaccoppiate = lstPreaccoppiati.FirstOrDefault(p => p.MezzoComposizione.Id == m.Codice)?.SquadreComposizione
                };

                var statoMezzo = statiOperativiMezzi.Find(x => x.CodiceMezzo.Equals(mc.Mezzo.Codice));
                if (statoMezzo != null) switch (mc.Mezzo.Stato)
                {
                    case Costanti.MezzoInSede:
                        mc.Mezzo.Stato = statiOperativiMezzi.Find(x => x.CodiceMezzo.Equals(mc.Mezzo.Codice)).StatoOperativo;
                        break;

                    case Costanti.MezzoInViaggio:
                        mc.Mezzo.IdRichiesta = statoMezzo.CodiceRichiesta;
                        break;

                    case Costanti.MezzoSulPosto: 
                        mc.IndirizzoIntervento = query.Richiesta.Localita.Indirizzo;
                        mc.Mezzo.IdRichiesta = statoMezzo.CodiceRichiesta;
                        break;

                    case Costanti.MezzoInRientro:
                        mc.ListaSquadre = lstSquadreComposizione.Result.FindAll(x => statiOperativiSquadre.FindAll(x => 
                            x.CodMezzo.Equals(mc.Mezzo.Codice)).Select(x => x.IdSquadra).Any(s => s.Equals(x.Squadra.Codice)));

                        mc.Mezzo.IdRichiesta = statoMezzo.CodiceRichiesta;
                        break;
                }

                return mc;
            }))
            //FILTRI E ORDINAMENTI
            .ContinueWith(lstCompMezzi => FiltraOrdina(query, lstCompMezzi.Result));


            //GESTIONE MEZZI ASSOCIATI
            Parallel.ForEach(lstSquadreComposizione.Result, composizione =>
            {
                if (composizione.Squadra.Stato.Equals(Squadra.StatoSquadra.InRientro))
                {
                    var listaCodiciMezzo = statiOperativiSquadre.FindAll(x => x.IdSquadra.Equals(composizione.Squadra.Id)).Select(x => x.CodMezzo).ToArray();
                    var lista = lstMezziComposizione.Result.FindAll(x => listaCodiciMezzo.Any(s => s.Equals(x.Mezzo.Codice)));

                    var listaMezziAssociati = lista.Select(MezzoComp => new Classi.Composizione.ComposizioneMezziAssociatiSquadre()
                    {
                        Id = MezzoComp.Id,
                        IndiceOrdinamento = MezzoComp.IndiceOrdinamento,
                        IndirizzoIntervento = MezzoComp.IndirizzoIntervento,
                        IstanteScadenzaSelezione = MezzoComp.IstanteScadenzaSelezione,
                        Km = MezzoComp.Km,
                        Mezzo = MezzoComp.Mezzo,
                        TempoPercorrenza = MezzoComp.TempoPercorrenza
                    });

                    composizione.ListaMezzi = listaMezziAssociati
                        .Where(c => c.Mezzo.Stato.Equals(Costanti.MezzoInRientro))
                        .ToList();
                }
            });

            #region Paginazione

            //PREPARO PAGINAZIONE IN BASE AI FILTRI
            var result = new ComposizionePartenzaAvanzataResult()
            {
                ComposizionePartenzaAvanzata = new Classi.Composizione.ComposizionePartenzaAvanzata()
                {
                    ComposizioneMezziDataArray = new List<Classi.Composizione.ComposizioneMezzi>(),
                    ComposizioneSquadreDataArray = new List<Classi.Composizione.ComposizioneSquadre>()
                }
            };

            if (query.Filtro.Mezzo != null)
            {
                //var indexMezzo = query.Filtro.Mezzo != null ? lstMezziComposizione.Result.FindIndex(c => c.Mezzo.Codice.Equals(query.Filtro.Mezzo.Codice)) : 0;
                //if (indexMezzo != 0)
                //    query.Filtro.MezziPagination.Page = (indexMezzo + 1) / query.Filtro.MezziPagination.PageSize + 1;

                //se mezzo in rientro
                if (lstMezziComposizione.Result.Find(c => c.Mezzo.Codice.Equals(query.Filtro.Mezzo.Codice)).Mezzo.Stato.Equals(Costanti.MezzoInRientro))
                {
                    result.ComposizionePartenzaAvanzata.ComposizioneMezziDataArray = lstMezziComposizione.Result
                        .FindAll(x => x.Mezzo.Distaccamento.Codice.Equals(query.Filtro.Mezzo.Distaccamento.Codice))
                        .Take(query.Filtro.MezziPagination.PageSize).ToList();

                    result.ComposizionePartenzaAvanzata.ComposizioneSquadreDataArray = lstSquadreComposizione.Result
                        .FindAll(x => x.ListaMezzi != null && x.ListaMezzi.Any(y => y.Mezzo.Codice.Equals(query.Filtro.Mezzo.Codice)))
                        .Take(query.Filtro.SquadrePagination.PageSize).ToList();
                }
                // se mezzo non in rientro
                else if (lstSquadreComposizione.Result.FindAll(x => x.MezzoPreaccoppiato != null && x.MezzoPreaccoppiato.Mezzo.Codice.Equals(query.Filtro.Mezzo.Codice)).Count > 0)
                {
                    result.ComposizionePartenzaAvanzata.ComposizioneMezziDataArray = lstMezziComposizione.Result
                        .FindAll(x => x.Mezzo.Distaccamento.Codice.Equals(query.Filtro.Mezzo.Distaccamento.Codice))
                        .Take(query.Filtro.MezziPagination.PageSize).ToList();

                    result.ComposizionePartenzaAvanzata.ComposizioneSquadreDataArray = lstSquadreComposizione.Result
                        .FindAll(x => x.MezzoPreaccoppiato != null && x.MezzoPreaccoppiato.Mezzo.Codice.Equals(query.Filtro.Mezzo.Codice))
                        .Take(query.Filtro.SquadrePagination.PageSize).ToList();
                }
            }
            else
            {
                result.ComposizionePartenzaAvanzata.ComposizioneMezziDataArray = lstMezziComposizione.Result
                    .Skip(query.Filtro.MezziPagination.PageSize * (query.Filtro.MezziPagination.Page - 1))
                    .Take(query.Filtro.MezziPagination.PageSize).ToList();

                result.ComposizionePartenzaAvanzata.ComposizioneSquadreDataArray = lstSquadreComposizione.Result
                    .Skip(query.Filtro.SquadrePagination.PageSize * (query.Filtro.SquadrePagination.Page - 1))
                    .Take(query.Filtro.SquadrePagination.PageSize).ToList();
            }

            if (query.Filtro.Squadre != null)
            {
                var indexSquadra = lstSquadreComposizione.Result.FindIndex(c => c.Squadra.Codice.Equals(query.Filtro.Squadre.FirstOrDefault().Codice));
                if (indexSquadra != 0)
                    query.Filtro.SquadrePagination.Page = (indexSquadra + 1) / query.Filtro.SquadrePagination.PageSize + 1;

                //SE SQUADRA E MEZZO IN RIENTRO
                if (lstSquadreComposizione.Result.Find(c => c.Squadra.Codice.Equals(query.Filtro.Squadre[0].Codice)).Squadra.Stato == Squadra.StatoSquadra.InRientro)
                {
                    var CodiciMezzo = lstSquadreComposizione.Result.Find(c => c.Squadra.Codice.Equals(query.Filtro.Squadre[0].Codice)).ListaMezzi;

                    result.ComposizionePartenzaAvanzata.ComposizioneMezziDataArray = lstMezziComposizione.Result
                        .FindAll(x => CodiciMezzo.Any(y => y.Mezzo.Codice.Equals(x.Mezzo.Codice)))
                        .Skip(query.Filtro.MezziPagination.PageSize * (query.Filtro.MezziPagination.Page - 1))
                        .Take(query.Filtro.MezziPagination.PageSize).ToList();

                    result.ComposizionePartenzaAvanzata.ComposizioneSquadreDataArray = lstSquadreComposizione.Result
                        .FindAll(x => x.ListaMezzi != null && x.ListaMezzi.Any(y => CodiciMezzo.Any(y => y.Mezzo.Codice.Equals(y.Mezzo.Codice))))
                        .Skip(query.Filtro.SquadrePagination.PageSize * (query.Filtro.SquadrePagination.Page - 1))
                        .Take(query.Filtro.SquadrePagination.PageSize).ToList();
                }
            }
            else
            {
                result.ComposizionePartenzaAvanzata.ComposizioneMezziDataArray = lstMezziComposizione.Result
                    .Skip(query.Filtro.MezziPagination.PageSize * (query.Filtro.MezziPagination.Page - 1))
                    .Take(query.Filtro.MezziPagination.PageSize).ToList();

                result.ComposizionePartenzaAvanzata.ComposizioneSquadreDataArray = lstSquadreComposizione.Result
                    .Skip(query.Filtro.SquadrePagination.PageSize * (query.Filtro.SquadrePagination.Page - 1))
                    .Take(query.Filtro.SquadrePagination.PageSize).ToList();
            }

            result.ComposizionePartenzaAvanzata.MezziPagination = new Paginazione()
            {
                Page = query.Filtro.MezziPagination.Page,
                PageSize = query.Filtro.MezziPagination.PageSize,
                TotalItems = lstMezziComposizione.Result.Count
            };
            result.ComposizionePartenzaAvanzata.SquadrePagination = new Paginazione()
            {
                Page = query.Filtro.SquadrePagination.Page,
                PageSize = query.Filtro.SquadrePagination.PageSize,
                TotalItems = lstSquadreComposizione.Result.Count
            };

            #endregion

            Log.Debug("Fine elaborazione Composizione partenza avanzata Handler");

            return result;
        }

        private List<Classi.Composizione.ComposizioneMezzi> FiltraOrdina(ComposizionePartenzaAvanzataQuery query, IEnumerable<Classi.Composizione.ComposizioneMezzi> lstCompMezzi)
        {
            return lstCompMezzi
                .Where(m => query.Filtro.StatoMezzo?.Contains(m.Mezzo.Stato.ToString()) ?? true)
                .Where(m =>
                {
                    if (!string.IsNullOrEmpty(query.Filtro.RicercaMezzi))
                        return m.Mezzo.Codice.Contains(query.Filtro.RicercaMezzi) || m.Mezzo.Descrizione.Contains(query.Filtro.RicercaMezzi);
                    return true;
                })
                .Where(m =>
                {
                    if (query.Filtro.CodiceDistaccamento != null && query.Filtro.CodiceDistaccamento.All(c => c != ""))
                        return query.Filtro.CodiceDistaccamento.Contains(m.Mezzo.Distaccamento.Codice);
                    return true;
                })
                .Where(m =>
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
                })
                .OrderByDescending(c =>
                {
                    if (query.Filtro.Squadre?.Any(s => s.PreAccoppiato) ?? false)
                        return c.Mezzo.PreAccoppiato;
                    return false;
                })
                .OrderByDescending(m => m.Mezzo.Stato == Costanti.MezzoInSede)
                .ThenByDescending(m => m.Mezzo.Stato == Costanti.MezzoInRientro)
                .ThenByDescending(m => m.Mezzo.Stato == Costanti.MezzoInViaggio)
                .ThenByDescending(m => m.Mezzo.Stato == Costanti.MezzoSulPosto)
                .ThenByDescending(m => m.IndiceOrdinamento)
                .ToList();
        }

        private List<Classi.Composizione.ComposizioneSquadre> FiltraOrdina(ComposizionePartenzaAvanzataQuery query, IEnumerable<Classi.Composizione.ComposizioneSquadre> lstCompSquadre, Tipologia tipologia90, Turno turnoCorrente, Turno turnoPrecedente, Turno turnoSuccessivo)
        {
            return lstCompSquadre.Where(s =>
            {
                if (!string.IsNullOrEmpty(query.Filtro.RicercaSquadre))
                    return s.Squadra.Codice.Contains(query.Filtro.RicercaSquadre);
                return true;
            })//.Where(s =>
            //{
            //    if (query.Filtro.CodiceDistaccamento != null && query.Filtro.CodiceDistaccamento.All(c => c != ""))
            //        return query.Filtro.CodiceDistaccamento.Contains(s.Squadra.Distaccamento.Codice);
            //    return true;
            //}).Where(s =>
            //{
            //    if (query.Filtro.Squadre != null && query.Filtro.Squadre.Count > 0 && query.Filtro.Squadre.FirstOrDefault().Distaccamento.Codice != null)
            //        return s.Squadra.Distaccamento.Codice == query.Filtro.Squadre.FirstOrDefault().Distaccamento.Codice;
            //    return true;
            //}).Where(s =>
            //{
            //    if (query.Filtro.Mezzo != null && query.Filtro.Mezzo.Distaccamento.Codice != null)
            //        return s.Squadra.Distaccamento.Codice == query.Filtro.Mezzo.Distaccamento.Codice;
            //    return true;
            /*})*/.Where(s => s.Squadra.DiEmergenza == query.Filtro.SquadreDiEmergenza)
            .Where(s =>
            {
                if (!query.Richiesta.Tipologie.Contains(tipologia90.Codice))
                    return s.Squadra.ColonnaMobile == query.Filtro.SquadreColonnaMobile;
                return true;
            })
            .Select(s =>
            {
                switch (query.Filtro.Turno)
                {
                    case FiltroTurnoRelativo.Precedente: s.Squadra.Turno = turnoPrecedente.Codice; break;
                    case FiltroTurnoRelativo.Successivo: s.Squadra.Turno = turnoSuccessivo.Codice; break;
                    case null: s.Squadra.Turno = turnoCorrente.Codice; break;
                }

                if (s.Squadra.Stato == Squadra.StatoSquadra.InRientro)
                    s.Squadra.Turno = turnoPrecedente.Codice;

                return s;
            })
            .Where(s => s != null)
            .OrderByDescending(c =>
            {
                if (query.Filtro.Mezzo?.PreAccoppiato ?? false)
                    return c.Squadra.PreAccoppiato;
                return false;
            })
            .OrderByDescending(c => c.Squadra.Stato == Squadra.StatoSquadra.InSede)
            .ThenByDescending(c => c.Squadra.Stato == Squadra.StatoSquadra.InRientro)
            .ThenByDescending(c => c.Squadra.Stato == Squadra.StatoSquadra.InViaggio)
            .ThenByDescending(c => c.Squadra.Stato == Squadra.StatoSquadra.SulPosto)
            .ThenByDescending(c => c.Squadra.IndiceOrdinamento)
            .ToList();
        }

        private decimal GetIndiceOrdinamento(Squadra squadra, RichiestaAssistenza richiesta)
        {
            if (squadra.Stato == Squadra.StatoSquadra.InSede)
            {
                switch (richiesta.Competenze.Select(c => c.Descrizione).ToList().FindIndex(c => c.Equals(squadra.Distaccamento.Descrizione)))
                {
                    case 0: return 3000;
                    case 1: return 2000;
                    case 2: return 1000;
                }
            }

            return 0;
        }
    }
}
