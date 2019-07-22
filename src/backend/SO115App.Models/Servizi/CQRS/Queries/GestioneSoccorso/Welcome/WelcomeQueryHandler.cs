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
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Boxes;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.SintesiRichiesteAssistenza;
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
        private readonly IQueryHandler<SintesiMezziMarkerQuery, SintesiMezziMarkerResult> _sintesiMezziMarkerHandler;
        private readonly IQueryHandler<SintesiRichiesteAssistenzaQuery, SintesiRichiesteAssistenzaResult> _sintesiRichiesteAssistenzaHandler;
        private readonly IQueryHandler<SintesiRichiesteAssistenzaMarkerQuery, SintesiRichiesteAssistenzaMarkerResult> _sintesiRichiesteAssistenzaMarkerHandler;
        private readonly IQueryHandler<SintesiSediMarkerQuery, SintesiSediMarkerResult> _sintesiSediMarkerHandler;
        private readonly IQueryHandler<ListaChiamateInCorsoMarkerQuery, ListaChiamateInCorsoMarkerResult> _listaChiamateInCorsoMarkerHandler;

        public WelcomeQueryHandler(IQueryHandler<BoxMezziQuery, BoxMezziResult> boxMezziHandler,
            IQueryHandler<BoxPersonaleQuery, BoxPersonaleResult> boxPersonaleHandler,
            IQueryHandler<BoxRichiesteQuery, BoxRichiesteResult> boxRichiesteHandler,
            IQueryHandler<SintesiMezziMarkerQuery, SintesiMezziMarkerResult> sintesiMezziMarkerHandler,
            IQueryHandler<SintesiRichiesteAssistenzaQuery, SintesiRichiesteAssistenzaResult> sintesiRichiesteAssistenzaHandler,
            IQueryHandler<SintesiRichiesteAssistenzaMarkerQuery, SintesiRichiesteAssistenzaMarkerResult> sintesiRichiesteAssistenzaMarkerHandler,
            IQueryHandler<SintesiSediMarkerQuery, SintesiSediMarkerResult> sintesiSediMarkerHandler,
            IQueryHandler<ListaChiamateInCorsoMarkerQuery, ListaChiamateInCorsoMarkerResult> listaChiamateInCorsoMarkerHandler
            )
        {
            this._boxMezziHandler = boxMezziHandler;
            this._boxPersonaleHandler = boxPersonaleHandler;
            this._boxRichiesteHandler = boxRichiesteHandler;
            this._sintesiMezziMarkerHandler = sintesiMezziMarkerHandler;
            this._sintesiRichiesteAssistenzaHandler = sintesiRichiesteAssistenzaHandler;
            this._sintesiRichiesteAssistenzaMarkerHandler = sintesiRichiesteAssistenzaMarkerHandler;
            this._sintesiSediMarkerHandler = sintesiSediMarkerHandler;
            this._listaChiamateInCorsoMarkerHandler = listaChiamateInCorsoMarkerHandler;
        }

        /// <summary>
        ///   Query che estrae i valori dei Box presenti in Home Page
        /// </summary>
        /// <param name="query">Filtri utilizzati per l'estrazione</param>
        /// <returns>Elenco dei mezzi disponibili</returns>
        public WelcomeResult Handle(WelcomeQuery query)
        {
            var boxMezziQuery = new BoxMezziQuery();
            var boxPersonaleQuery = new BoxPersonaleQuery();
            var boxRichiesteQuery = new BoxRichiesteQuery();
            var sintesiMezziMarkerQuery = new SintesiMezziMarkerQuery();
            var sintesiRichiesteAssistenzaQuery = new SintesiRichiesteAssistenzaQuery();
            var sintesiRichiesteAssistenzaMarkerQuery = new SintesiRichiesteAssistenzaMarkerQuery();
            var sintesiSediMarkerQuery = new SintesiSediMarkerQuery();
            var listaQuery = new ListaChiamateInCorsoMarkerQuery();

            var welcome = new SO115App.Models.Classi.Condivise.Welcome()
            {
                BoxListaInterventi = _boxRichiesteHandler.Handle(boxRichiesteQuery).BoxRichieste,
                BoxListaMezzi = _boxMezziHandler.Handle(boxMezziQuery).BoxMezzi,
                BoxListaPersonale = _boxPersonaleHandler.Handle(boxPersonaleQuery).BoxPersonale,
                ListaChiamateInCorso = (List<ChiamateInCorso>)_listaChiamateInCorsoMarkerHandler.Handle(listaQuery).ListaChiamateInCorsoMarker,
                ListaMezziMarker = (List<SintesiMezzoMarker>)_sintesiMezziMarkerHandler.Handle(sintesiMezziMarkerQuery).SintesiMezziMarker,
                ListaSintesi = (List<SintesiRichiesta>)_sintesiRichiesteAssistenzaHandler.Handle(sintesiRichiesteAssistenzaQuery).SintesiRichiesta,
                ListaSediMarker = (List<SintesiSedeMarker>)_sintesiSediMarkerHandler.Handle(sintesiSediMarkerQuery).SintesiSediMarker,
                ListaRichiesteMarker = (List<SintesiRichiestaMarker>)_sintesiRichiesteAssistenzaMarkerHandler.Handle(sintesiRichiesteAssistenzaMarkerQuery).SintesiRichiestaMarker
            };

            return new WelcomeResult()
            {
                WelcomeRes = welcome
            };
        }
    }
}
