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
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.ComposizionePartenzaAvanzata;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.SintesiRichiesteAssistenza;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.RicercaRichiesteAssistenza;
using SO115App.Models.Classi.Filtri;
using SO115App.Models.Servizi.CQRS.Queries.GestioneRubrica;
using SO115App.Models.Servizi.Infrastruttura.Box;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.GestioneTipologie;
using SO115App.Models.Servizi.Infrastruttura.GetFiltri;
using SO115App.Models.Servizi.Infrastruttura.Marker;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Gac;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Squadre;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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
            IGetChiamateInCorso listaChiamateInCorsoMarkerHandler,
            IGetCentroMappaMarker centroMappaMarkerHandler,
            IGetFiltri filtriHandler,
            IGetListaDistaccamentiByPinListaSedi getDistaccamenti,
            IGetConteggioSchede getConteggioSchedeHandler,
            IGetTipologieByCodice tipologieQueryHandler,
            IGetAlberaturaUnitaOperative getAlberaturaUnitaOperative,
            IQueryHandler<RubricaQuery, RubricaResult> rubricaQueryHandler)
        {
            _boxMezziHandler = boxMezziHandler;
            _boxPersonaleHandler = boxPersonaleHandler;
            _boxRichiesteHandler = boxRichiesteHandler;
            _listaChiamateInCorsoMarkerHandler = listaChiamateInCorsoMarkerHandler;
            _centroMappaMarkerHandler = centroMappaMarkerHandler;
            _filtriHandler = filtriHandler;
            _getDistaccamenti = getDistaccamenti;
            _getConteggioSchedeHandler = getConteggioSchedeHandler;
            _tipologieQueryHandler = tipologieQueryHandler;
            _getAlberaturaUnitaOperative = getAlberaturaUnitaOperative;
            _rubricaQueryHandler = rubricaQueryHandler;
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

            var rubrica = Task.Factory.StartNew(() => _rubricaQueryHandler.Handle(new RubricaQuery() { IdOperatore = query.idOperatore, IdSede = query.CodiceSede, Filters = new FiltriRubrica() { Search = "" }, Pagination = default }).DataArray);
            var boxListaInterventi = Task.Factory.StartNew(() => _boxRichiesteHandler.Get(pinNodi.ToHashSet()));
            var boxListaMezzi = Task.Factory.StartNew(() => _boxMezziHandler.Get(query.CodiceSede));
            var boxListaPersonale = Task.Factory.StartNew(() => _boxPersonaleHandler.Get(query.CodiceSede));
            var listaChiamateInCorso = Task.Factory.StartNew(() => _listaChiamateInCorsoMarkerHandler.Get(pinNodi));
            var centroMappaMarker = Task.Factory.StartNew(() => _centroMappaMarkerHandler.GetCentroMappaMarker(query.CodiceSede[0]));
            var infoNue = Task.Factory.StartNew(() => _getConteggioSchedeHandler.GetConteggio(query.CodiceSede));
            var tipologie = Task.Factory.StartNew(() => _tipologieQueryHandler.Get());

            var welcome = new SO115App.Models.Classi.Condivise.Welcome()
            {
                BoxListaInterventi = boxListaInterventi.Result,
                BoxListaMezzi = boxListaMezzi.Result,
                BoxListaPersonale = boxListaPersonale.Result,
                ListaChiamateInCorso = listaChiamateInCorso.Result,
                CentroMappaMarker = centroMappaMarker.Result,
                ListaFiltri = filtri,
                InfoNue = infoNue.Result,
                Tipologie = tipologie.Result,
                Rubrica = rubrica.Result
            };

            Log.Debug("Fine elaborazione Welcome Handler");

            return new WelcomeResult()
            {
                WelcomeRes = welcome
            };
        }
    }
}
