//-----------------------------------------------------------------------
// <copyright file="NavbarQueryHandler.cs" company="CNVVF">
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
using SO115App.API.Models.Classi.Organigramma;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.SintesiRichiesteAssistenza;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.RicercaRichiesteAssistenza;
using SO115App.Models.Servizi.CQRS.Queries.GestioneRubrica;
using SO115App.Models.Servizi.Infrastruttura.Box;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.GestioneTipologie;
using SO115App.Models.Servizi.Infrastruttura.GetFiltri;
using SO115App.Models.Servizi.Infrastruttura.Marker;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Welcome
{
    /// <summary>
    ///   Servizio che restituisce tutti i valori della Navbar.
    /// </summary>
    public class WelcomeQueryHandler : IQueryHandler<WelcomeQuery, WelcomeResult>
    {
        private readonly IGetBoxMezzi _boxMezziHandler;
        private readonly IGetBoxPersonale _boxPersonaleHandler;
        private readonly IGetBoxRichieste _boxRichiesteHandler;
        private readonly IQueryHandler<SintesiRichiesteAssistenzaQuery, SintesiRichiesteAssistenzaResult> _sintesiRichiesteAssistenzaHandler;
        private readonly IGetChiamateInCorso _listaChiamateInCorsoMarkerHandler;
        private readonly IGetCentroMappaMarker _centroMappaMarkerHandler;
        private readonly IGetFiltri _filtriHandler;
        private readonly IGetListaDistaccamentiByPinListaSedi _getDistaccamenti;
        private readonly IGetConteggioSchede _getConteggioSchedeHandler;
        private readonly IGetTipologieByCodice _tipologieQueryHandler;
        private readonly IGetAlberaturaUnitaOperative _getAlberaturaUnitaOperative;
        private readonly IQueryHandler<RubricaQuery, RubricaResult> _rubricaQueryHandler;

        public WelcomeQueryHandler(IGetBoxMezzi boxMezziHandler,
            IGetBoxPersonale boxPersonaleHandler,
            IGetBoxRichieste boxRichiesteHandler,
            IQueryHandler<SintesiRichiesteAssistenzaQuery, SintesiRichiesteAssistenzaResult> sintesiRichiesteAssistenzaHandler,
            IGetChiamateInCorso listaChiamateInCorsoMarkerHandler,
            IGetCentroMappaMarker centroMappaMarkerHandler,
            IGetFiltri filtriHandler,
            IGetListaDistaccamentiByPinListaSedi getDistaccamenti,
            IGetConteggioSchede getConteggioSchedeHandler,
            IGetTipologieByCodice tipologieQueryHandler,
            IGetAlberaturaUnitaOperative getAlberaturaUnitaOperative,
            IQueryHandler<RubricaQuery, RubricaResult> rubricaQueryHandler)
        {
            this._boxMezziHandler = boxMezziHandler;
            this._boxPersonaleHandler = boxPersonaleHandler;
            this._boxRichiesteHandler = boxRichiesteHandler;
            this._sintesiRichiesteAssistenzaHandler = sintesiRichiesteAssistenzaHandler;
            this._listaChiamateInCorsoMarkerHandler = listaChiamateInCorsoMarkerHandler;
            this._centroMappaMarkerHandler = centroMappaMarkerHandler;
            this._filtriHandler = filtriHandler;
            this._getDistaccamenti = getDistaccamenti;
            this._getConteggioSchedeHandler = getConteggioSchedeHandler;
            this._tipologieQueryHandler = tipologieQueryHandler;
            this._getAlberaturaUnitaOperative = getAlberaturaUnitaOperative;
            this._rubricaQueryHandler = rubricaQueryHandler;
        }

        /// <summary>
        ///   Query che estrae tutti i parametri iniziali della Home Page
        /// </summary>
        /// <param name="query">Filtri utilizzati per l'estrazione</param>
        /// <returns>Tutti i parametri iniziali della Home Page</returns>
        public WelcomeResult Handle(WelcomeQuery query)
        {
            Log.Debug("Inizio elaborazione Welcome Handler");

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

            FiltroRicercaRichiesteAssistenza filtro = new FiltroRicercaRichiesteAssistenza
            {
                SearchKey = "0",
                idOperatore = query.idOperatore,
                UnitaOperative = pinNodi.ToHashSet()
            };

            var sintesiRichiesteAssistenzaQuery = new SintesiRichiesteAssistenzaQuery()
            {
                CodiciSede = query.CodiceSede,
                Filtro = filtro
            };

            var filtri = _filtriHandler.Get();

            if (query.CodiceSede[0].Equals("CON"))
                filtri.Distaccamenti = _getDistaccamenti.GetListaDistaccamenti(pinNodi.ToHashSet().ToList());
            else
                filtri.Distaccamenti = _getDistaccamenti.GetListaDistaccamenti(pinNodiNoDistaccamenti);

            try
            {
                var rubrica = _rubricaQueryHandler.Handle(new RubricaQuery() { IdOperatore = query.idOperatore, IdSede = query.CodiceSede, Search = "", Pagination = default }).Rubrica;
                var boxListaInterventi = _boxRichiesteHandler.Get(pinNodi.ToHashSet());
                var boxListaMezzi = _boxMezziHandler.Get(query.CodiceSede);
                var boxListaPersonale = _boxPersonaleHandler.Get(query.CodiceSede);
                var listaChiamateInCorso = _listaChiamateInCorsoMarkerHandler.Get(pinNodi);
                var listaSintesi = _sintesiRichiesteAssistenzaHandler.Handle(sintesiRichiesteAssistenzaQuery);
                var centroMappaMarker = _centroMappaMarkerHandler.GetCentroMappaMarker(query.CodiceSede[0]);
                var listaFiltri = filtri;
                var infoNue = _getConteggioSchedeHandler.GetConteggio(query.CodiceSede);
                var tipologie = _tipologieQueryHandler.Get();

                var welcome = new SO115App.Models.Classi.Condivise.Welcome()
                {
                    BoxListaInterventi = boxListaInterventi,
                    BoxListaMezzi = boxListaMezzi,
                    BoxListaPersonale = boxListaPersonale,
                    ListaChiamateInCorso = listaChiamateInCorso,
                    ListaSintesi = listaSintesi,
                    CentroMappaMarker = centroMappaMarker,
                    ListaFiltri = listaFiltri,
                    InfoNue = infoNue,
                    Tipologie = tipologie,
                    Rubrica = rubrica
                };

                Log.Debug("Fine elaborazione Welcome Handler");

                return new WelcomeResult()
                {
                    WelcomeRes = welcome
                };
            }
            catch (System.Exception ex)
            {
                throw;
            }
        }
    }
}
