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
using SO115App.API.Models.Classi.Marker;
using SO115App.API.Models.Servizi.CQRS.Queries.Filtri;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Boxes;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.SintesiRichiesteAssistenza;
using SO115App.API.Models.Servizi.CQRS.Queries.Marker.CentroMappaMarker;
using SO115App.API.Models.Servizi.CQRS.Queries.Marker.ListaChiamateInCorsoMarker;
using SO115App.API.Models.Servizi.CQRS.Queries.Marker.SintesiMezziMarker;
using SO115App.API.Models.Servizi.CQRS.Queries.Marker.SintesiRichiesteAssistenzaMarker;
using SO115App.API.Models.Servizi.CQRS.Queries.Marker.SintesiSediMarker;
using SO115App.Models.Classi.Marker;
using System.Collections.Generic;

namespace SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Welcome
{
    /// <summary>
    ///   Servizio che restituisce tutti i valori della Navbar.
    /// </summary>
    public class WelcomeQueryHandler : IQueryHandler<WelcomeQuery, WelcomeResult>
    {
        private readonly IQueryHandler<BoxMezziQuery, BoxMezziResult> _boxMezziHandler;
        private readonly IQueryHandler<BoxPersonaleQuery, BoxPersonaleResult> _boxPersonaleHandler;
        private readonly IQueryHandler<BoxRichiesteQuery, BoxRichiesteResult> _boxRichiesteHandler;
        private readonly IQueryHandler<SintesiRichiesteAssistenzaQuery, SintesiRichiesteAssistenzaResult> _sintesiRichiesteAssistenzaHandler;
        private readonly IQueryHandler<ListaChiamateInCorsoMarkerQuery, ListaChiamateInCorsoMarkerResult> _listaChiamateInCorsoMarkerHandler;
        private readonly IQueryHandler<CentroMappaMarkerQuery, CentroMappaMarkerResult> _centroMappaMarkerHandler;
        private readonly IQueryHandler<FiltriQuery, FiltriResult> _filtriHandler;

        public WelcomeQueryHandler(IQueryHandler<BoxMezziQuery, BoxMezziResult> boxMezziHandler,
            IQueryHandler<BoxPersonaleQuery, BoxPersonaleResult> boxPersonaleHandler,
            IQueryHandler<BoxRichiesteQuery, BoxRichiesteResult> boxRichiesteHandler,
            IQueryHandler<SintesiRichiesteAssistenzaQuery, SintesiRichiesteAssistenzaResult> sintesiRichiesteAssistenzaHandler,
            IQueryHandler<ListaChiamateInCorsoMarkerQuery, ListaChiamateInCorsoMarkerResult> listaChiamateInCorsoMarkerHandler,
            IQueryHandler<CentroMappaMarkerQuery, CentroMappaMarkerResult> centroMappaMarkerHandler,
            IQueryHandler<FiltriQuery, FiltriResult> filtriHandler
            )
        {
            this._boxMezziHandler = boxMezziHandler;
            this._boxPersonaleHandler = boxPersonaleHandler;
            this._boxRichiesteHandler = boxRichiesteHandler;
            this._sintesiRichiesteAssistenzaHandler = sintesiRichiesteAssistenzaHandler;
            this._listaChiamateInCorsoMarkerHandler = listaChiamateInCorsoMarkerHandler;
            this._centroMappaMarkerHandler = centroMappaMarkerHandler;
            this._filtriHandler = filtriHandler;
        }

        /// <summary>
        ///   Query che estrae tutti i parametri iniziali della Home Page
        /// </summary>
        /// <param name="query">Filtri utilizzati per l'estrazione</param>
        /// <returns>Tutti i parametri iniziali della Home Page</returns>
        public WelcomeResult Handle(WelcomeQuery query)
        {
            var boxMezziQuery = new BoxMezziQuery()
            {
                CodiceSede = query.CodiceSede
            };
            var boxPersonaleQuery = new BoxPersonaleQuery()
            {
                CodiceSede = query.CodiceSede
            };
            var boxRichiesteQuery = new BoxRichiesteQuery()
            {
                CodiceSede = query.CodiceSede
            };
            var sintesiRichiesteAssistenzaQuery = new SintesiRichiesteAssistenzaQuery()
            {
                CodiceSede = query.CodiceSede
            };
            var listaQuery = new ListaChiamateInCorsoMarkerQuery()
            {
                CodiceSede = query.CodiceSede
            };
            var centroMappaQuery = new CentroMappaMarkerQuery()
            {
                CodiceSede = query.CodiceSede
            };
            var ListaFiltriQuery = new FiltriQuery();

            var welcome = new SO115App.Models.Classi.Condivise.Welcome()
            {
                BoxListaInterventi = _boxRichiesteHandler.Handle(boxRichiesteQuery).BoxRichieste,
                BoxListaMezzi = _boxMezziHandler.Handle(boxMezziQuery).BoxMezzi,
                BoxListaPersonale = _boxPersonaleHandler.Handle(boxPersonaleQuery).BoxPersonale,
                ListaChiamateInCorso = (List<ChiamateInCorso>)_listaChiamateInCorsoMarkerHandler.Handle(listaQuery).ListaChiamateInCorsoMarker,
                ListaSintesi = (List<SintesiRichiesta>)_sintesiRichiesteAssistenzaHandler.Handle(sintesiRichiesteAssistenzaQuery).SintesiRichiesta,
                CentroMappaMarker = _centroMappaMarkerHandler.Handle(centroMappaQuery).CentroMappaMarker,
                ListaFiltri = _filtriHandler.Handle(ListaFiltriQuery).Filtri
            };

            return new WelcomeResult()
            {
                WelcomeRes = welcome
            };
        }
    }
}
