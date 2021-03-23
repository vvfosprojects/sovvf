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
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Classi.Composizione;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Classi.Filtri;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using SO115App.Models.Servizi.Infrastruttura.GeoFleet;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.GestioneTipologie;
using SO115App.Models.Servizi.Infrastruttura.GestioneStatoOperativoSquadra;
using SO115App.Models.Servizi.Infrastruttura.GetPreAccoppiati;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Gac;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Squadre;
using SO115App.Models.Servizi.Infrastruttura.Turni;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.ComposizionePartenzaAvanzata
{
    public class ComposizionePartenzaAvanzataQueryHandler : IQueryHandler<ComposizionePartenzaAvanzataQuery, ComposizionePartenzaAvanzataResult>
    {
        #region Servizi

        private readonly IGetListaSquadre _getListaSquadre;
        private readonly IGetMezziUtilizzabili _getMezziUtilizzabili;
        private readonly IGetStatoSquadra _getStatoSquadre;
        private readonly IGetStatoMezzi _getMezziPrenotati;
        private readonly IGetPosizioneFlotta _getPosizioneFlotta;
        private readonly IGetPreAccoppiati _getPreAccoppiati;

        private readonly IGetTipologieByCodice _getTipologieByCodice;
        private readonly IGetTurno _getTurno;
        private readonly IGetAlberaturaUnitaOperative _getAlberaturaUnitaOperative;
        private readonly IGetListaDistaccamentiByPinListaSedi _getDistaccamenti;

        #endregion Servizi

        public ComposizionePartenzaAvanzataQueryHandler(
            IGetListaSquadre getListaSquadre,
            IGetStatoSquadra getStatoSquadre,
            IGetStatoMezzi getMezziPrenotati,
            IGetMezziUtilizzabili getMezziUtilizzabili,
            IGetPosizioneFlotta getPosizioneFlotta,
            IGetPreAccoppiati getPreAccoppiati,

            IGetTipologieByCodice getTipologieByCodice,
            IGetTurno getTurno,
            IGetAlberaturaUnitaOperative getAlberaturaUnitaOperative,
            IGetListaDistaccamentiByPinListaSedi getDistaccamenti)
        {
            _getListaSquadre = getListaSquadre;
            _getMezziPrenotati = getMezziPrenotati;
            _getMezziUtilizzabili = getMezziUtilizzabili;
            _getStatoSquadre = getStatoSquadre;
            _getPosizioneFlotta = getPosizioneFlotta;
            _getPreAccoppiati = getPreAccoppiati;
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
            {
                pinNodi.Add(new PinNodo(figlio.Codice, true));
            }

            IEnumerable<string> lstSediPreaccoppiati;
            if (query.CodiceSede[0].Equals("CON"))
                lstSediPreaccoppiati = _getDistaccamenti.GetListaDistaccamenti(pinNodi.ToHashSet().ToList()).Select(x => x.Id.ToString());
            else
                lstSediPreaccoppiati = _getDistaccamenti.GetListaDistaccamenti(pinNodiNoDistaccamenti).Select(x => x.Id.ToString());

            var lstPosizioneFlotta = _getPosizioneFlotta.Get(0);

            var tipologia90 = _getTipologieByCodice.Get(new List<string> { "90" }).First();

            var turnoCorrente = _getTurno.Get();
            var turnoPrecedente = _getTurno.Get(turnoCorrente.DataOraInizio.AddMilliseconds(-1));
            var turnoSuccessivo = _getTurno.Get(turnoCorrente.DataOraFine.AddMinutes(1));

            var statiOperativiMezzi = _getMezziPrenotati.Get(query.CodiceSede);
            var statiOperativiSquadre = _getStatoSquadre.Get(query.CodiceSede.ToList());

            var lstPreaccoppiati = _getPreAccoppiati.GetFake(new PreAccoppiatiQuery() { CodiceSede = lstSediPreaccoppiati.ToArray(), Filtri = new FiltriPreaccoppiati() }).Select(p =>
            {
                p.SquadreComposizione = p.SquadreComposizione.Select(comp =>
                {
                    comp.Squadra.PreAccoppiato = true;
                    comp.MezzoPreaccoppiato = p.MezzoComposizione;
                    comp.MezzoPreaccoppiato.Mezzo.Stato = statiOperativiMezzi?.FirstOrDefault(m => m.CodiceMezzo.Equals(p.MezzoComposizione.Mezzo.Codice))?.StatoOperativo ?? Costanti.MezzoInSede ?? Costanti.MezzoInSede;
                    return comp;
                }).ToList();

                return p;
            });

            //REPERISCO I DATI, FACCIO IL MAPPING ED APPLICO I FILTRI (MEZZI E SQUADRE)
            var lstSquadreComposizione = _getListaSquadre.Get(query.CodiceSede.ToList())
                //MAPPING
                .ContinueWith(lstsquadre => lstsquadre.Result.Select(squadra =>
                {
                    if (statiOperativiSquadre.Exists(x => x.IdSquadra.Equals(squadra.Id)))
                        squadra.Stato = MappaStatoSquadraDaStatoMezzo.MappaStato(statiOperativiSquadre.Find(x => x.IdSquadra.Equals(squadra.Id)).StatoSquadra);
                    else
                        squadra.Stato = Squadra.StatoSquadra.InSede;

                    var comp = new Classi.Composizione.ComposizioneSquadre()
                    {
                        Id = squadra.Id,
                        Squadra = squadra,
                        MezzoPreaccoppiato = lstPreaccoppiati.FirstOrDefault(p => p.SquadreComposizione.Select(s => s.Id).Contains(squadra.Id))?.MezzoComposizione
                    };

                    if (comp.MezzoPreaccoppiato != null && comp.MezzoPreaccoppiato.Mezzo != null && statiOperativiMezzi.Count > 0)
                        comp.MezzoPreaccoppiato.Mezzo.Stato = statiOperativiMezzi.FirstOrDefault(m => m.CodiceMezzo == comp.MezzoPreaccoppiato.Mezzo.Codice)?.StatoOperativo ?? Costanti.MezzoInSede;

                    squadra.PreAccoppiato = lstPreaccoppiati.SelectMany(p => p.SquadreComposizione).Select(cc => cc.Squadra).FirstOrDefault(s => s.Codice == squadra.Codice)?.PreAccoppiato ?? false;
                    squadra.IndiceOrdinamento = GetIndiceOrdinamento(comp, query.Richiesta);

                    return comp;
                }))
                //FILTRI E ORDINAMENTI
                .ContinueWith(lstCompSquadre => FiltraOrdina(query, lstCompSquadre.Result, tipologia90, turnoCorrente, turnoPrecedente, turnoSuccessivo));

            var lstMezziComposizione = _getMezziUtilizzabili.Get(query.CodiceSede.ToList(), posizioneFlotta: lstPosizioneFlotta.Result)
                //MAPPING
                .ContinueWith(lstMezzi => lstMezzi.Result.Select(m =>
                {
                    var mc = new Classi.Composizione.ComposizioneMezzi()
                    {
                        Id = m.Codice,
                        Mezzo = m,
                        Km = new Random().Next(1, 60).ToString(),
                        TempoPercorrenza = Math.Round(Convert.ToDouble(new Random().Next(1, 60).ToString().Replace(".", ",")) / 1.75, 2).ToString(CultureInfo.InvariantCulture),
                        SquadrePreaccoppiate = lstPreaccoppiati.FirstOrDefault(p => p.MezzoComposizione.Id == m.Codice)?.SquadreComposizione
                    };

                    if (statiOperativiMezzi.Find(x => x.CodiceMezzo.Equals(mc.Mezzo.Codice)) != null)
                    {
                        mc.Id = mc.Mezzo.Codice;
                        mc.IstanteScadenzaSelezione = statiOperativiMezzi.Find(x => x.CodiceMezzo.Equals(mc.Mezzo.Codice)).IstanteScadenzaSelezione;

                        if (mc.Mezzo.Stato.Equals(Costanti.MezzoInSede))
                            mc.Mezzo.Stato = statiOperativiMezzi.Find(x => x.CodiceMezzo.Equals(mc.Mezzo.Codice)).StatoOperativo;

                        if (mc.Mezzo.Stato.Equals(Costanti.MezzoSulPosto))
                            mc.IndirizzoIntervento = query.Richiesta.Localita.Indirizzo;

                        if (mc.Mezzo.Stato.Equals(Costanti.MezzoInRientro))
                        {
                            var listaCodiciSquadre = statiOperativiSquadre.FindAll(x => x.CodMezzo.Equals(mc.Mezzo.Codice)).Select(x => x.IdSquadra).ToArray();
                            mc.ListaSquadre = lstSquadreComposizione.Result.FindAll(x => listaCodiciSquadre.Any(s => s.Equals(x.Squadra.Codice)));
                        }
                    }

                    mc.Mezzo.PreAccoppiato = lstPreaccoppiati.FirstOrDefault(m => m.MezzoComposizione.Mezzo.Codice == mc.Mezzo.Codice)?.MezzoComposizione.Mezzo.PreAccoppiato ?? false;

                    return mc;
                }))
                //FILTRI E ORDINAMENTI
                .ContinueWith(lstCompMezzi => FiltraOrdina(query, lstCompMezzi.Result));

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

            //PREPARO PAGINAZIONE IN BASE AI FILTRI

            //COMPONGO IL DTO E FACCIO LA PAGINAZIONE
            var result = new ComposizionePartenzaAvanzataResult()
            {
                ComposizionePartenzaAvanzata = new Classi.Composizione.ComposizionePartenzaAvanzata()
                {
                    ComposizioneMezziDataArray = new List<Classi.Composizione.ComposizioneMezzi>() { },
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
                else
                {// se mezzo non in rientro
                    if (lstSquadreComposizione.Result.FindAll(x => x.MezzoPreaccoppiato != null && x.MezzoPreaccoppiato.Mezzo.Codice.Equals(query.Filtro.Mezzo.Codice)).Count > 0)
                    {
                        result.ComposizionePartenzaAvanzata.ComposizioneMezziDataArray = lstMezziComposizione.Result
                            .FindAll(x => x.Mezzo.Distaccamento.Codice.Equals(query.Filtro.Mezzo.Distaccamento.Codice))
                            .Take(query.Filtro.MezziPagination.PageSize).ToList();

                        result.ComposizionePartenzaAvanzata.ComposizioneSquadreDataArray = lstSquadreComposizione.Result
                            .FindAll(x => x.MezzoPreaccoppiato != null && x.MezzoPreaccoppiato.Mezzo.Codice.Equals(query.Filtro.Mezzo.Codice))
                            .Take(query.Filtro.SquadrePagination.PageSize).ToList();
                    }
                    else
                    {
                        // PAGINAZIONE STANDARD
                        result.ComposizionePartenzaAvanzata.ComposizioneMezziDataArray = lstMezziComposizione.Result
                                .Skip(query.Filtro.MezziPagination.PageSize * (query.Filtro.MezziPagination.Page - 1))
                                .Take(query.Filtro.MezziPagination.PageSize).ToList();

                        result.ComposizionePartenzaAvanzata.ComposizioneSquadreDataArray = lstSquadreComposizione.Result
                               .Skip(query.Filtro.SquadrePagination.PageSize * (query.Filtro.SquadrePagination.Page - 1))
                               .Take(query.Filtro.SquadrePagination.PageSize).ToList();
                    }
                }
            }
            else if (query.Filtro.Squadre != null)
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
                else
                {
                    //PAGINAZINE STANDARD
                    result.ComposizionePartenzaAvanzata.ComposizioneMezziDataArray = lstMezziComposizione.Result
                            .Skip(query.Filtro.MezziPagination.PageSize * (query.Filtro.MezziPagination.Page - 1))
                            .Take(query.Filtro.MezziPagination.PageSize).ToList();

                    result.ComposizionePartenzaAvanzata.ComposizioneSquadreDataArray = lstSquadreComposizione.Result
                           .Skip(query.Filtro.SquadrePagination.PageSize * (query.Filtro.SquadrePagination.Page - 1))
                           .Take(query.Filtro.SquadrePagination.PageSize).ToList();
                }
            }
            else
            {
                //PAGINAZIONE STANDARD
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

            Log.Debug("Fine elaborazione Composizione partenza avanzata Handler");

            return result;
        }

        //private

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
                if (query.Filtro.Mezzo != null && query.Filtro.Mezzo.Distaccamento.Codice != null)
                    return s.Squadra.Distaccamento.Codice == query.Filtro.Mezzo.Distaccamento.Codice;
                return true;
            }).Where(s => s.Squadra.DiEmergenza == query.Filtro.SquadreDiEmergenza)
            .Where(s =>
            {
                if (!query.Richiesta.Tipologie.Contains(tipologia90.Codice))
                    return s.Squadra.ColonnaMobile == query.Filtro.SquadreColonnaMobile;
                return true;
            })

            //FILTRO TURNO FUNZIONANTE SOLO IN TEST
#if !DEBUG
            .Where(s =>
            {
                if (turnoPrecedente != null)
                    return turnoPrecedente.Contains(s.Squadra.Turno);
                else if (turnoPrecedente != null)
                    return turnoSuccessivo.Contains(s.Squadra.Turno);
                return turnoCorrente.Codice.Contains(s.Squadra.Turno);
            })
#endif
            //QUI MASCHERO I RISULTATI MOSTRANDO, SEMPRE, ALMENO UNA SQUADRA PER TURNO
#if DEBUG
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
#endif
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

        private decimal GetIndiceOrdinamento(Classi.Composizione.ComposizioneSquadre composizione, RichiestaAssistenza richiesta)
        {
            int ValoreCompetenza = 0;

            if (composizione.Squadra.Stato == Squadra.StatoSquadra.InSede)
            {
                switch (richiesta.Competenze.Select(c => c.Descrizione).ToList().FindIndex(c => c.Equals(composizione.Squadra.Distaccamento.Descrizione)))
                {
                    case 0: ValoreCompetenza = 3000; break;
                    case 1: ValoreCompetenza = 2000; break;
                    case 2: ValoreCompetenza = 1000; break;
                }
            }

            return ValoreCompetenza;
        }
    }
}
