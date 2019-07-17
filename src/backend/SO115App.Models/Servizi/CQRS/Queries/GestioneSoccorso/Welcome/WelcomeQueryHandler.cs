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
        private readonly IQueryHandler<BoxMezziQuery, BoxMezziResult> _BoxMezzihandler;
        private readonly IQueryHandler<BoxPersonaleQuery, BoxPersonaleResult> _BoxPersonalehandler;
        private readonly IQueryHandler<BoxRichiesteQuery, BoxRichiesteResult> _BoxRichiestehandler;
        private readonly IQueryHandler<SintesiMezziMarkerQuery, SintesiMezziMarkerResult> _SintesiMezziMarkerhandler;
        private readonly IQueryHandler<SintesiRichiesteAssistenzaQuery, SintesiRichiesteAssistenzaResult> _SintesiRichiesteAssistenzahandler;
        private readonly IQueryHandler<SintesiRichiesteAssistenzaMarkerQuery, SintesiRichiesteAssistenzaMarkerResult> _SintesiRichiesteAssistenzaMarkerhandler;
        private readonly IQueryHandler<SintesiSediMarkerQuery, SintesiSediMarkerResult> _SintesiSediMarkerhandler;
        private readonly IQueryHandler<ListaChiamateInCorsoMarkerQuery, ListaChiamateInCorsoMarkerResult> _listaChiamateInCorsoMarkerhandler;

        public WelcomeQueryHandler(IQueryHandler<BoxMezziQuery, BoxMezziResult> BoxMezzihandler,
            IQueryHandler<BoxPersonaleQuery, BoxPersonaleResult> BoxPersonalehandler,
            IQueryHandler<BoxRichiesteQuery, BoxRichiesteResult> BoxRichiestehandler,
            IQueryHandler<SintesiMezziMarkerQuery, SintesiMezziMarkerResult> SintesiMezziMarkerhandler,
            IQueryHandler<SintesiRichiesteAssistenzaQuery, SintesiRichiesteAssistenzaResult> SintesiRichiesteAssistenzahandler,
            IQueryHandler<SintesiRichiesteAssistenzaMarkerQuery, SintesiRichiesteAssistenzaMarkerResult> SintesiRichiesteAssistenzaMarkerhandler,
            IQueryHandler<SintesiSediMarkerQuery, SintesiSediMarkerResult> SintesiSediMarkerhandler,
            IQueryHandler<ListaChiamateInCorsoMarkerQuery, ListaChiamateInCorsoMarkerResult> ListaChiamateInCorsoMarkerhandler
            )
        {
            this._BoxMezzihandler = BoxMezzihandler;
            this._BoxPersonalehandler = BoxPersonalehandler;
            this._BoxRichiestehandler = BoxRichiestehandler;
            this._SintesiMezziMarkerhandler = SintesiMezziMarkerhandler;
            this._SintesiRichiesteAssistenzahandler = SintesiRichiesteAssistenzahandler;
            this._SintesiRichiesteAssistenzaMarkerhandler = SintesiRichiesteAssistenzaMarkerhandler;
            this._SintesiSediMarkerhandler = SintesiSediMarkerhandler;
            this._listaChiamateInCorsoMarkerhandler = ListaChiamateInCorsoMarkerhandler;
        }

        /// <summary>
        ///   Query che estrae i valori dei Box presenti in Home Page
        /// </summary>
        /// <param name="query">Filtri utilizzati per l'estrazione</param>
        /// <returns>Elenco dei mezzi disponibili</returns>
        public WelcomeResult Handle(WelcomeQuery query)
        {
            var BoxMezziquery = new BoxMezziQuery();
            var BoxPersonalequery = new BoxPersonaleQuery();
            var BoxRichiestequery = new BoxRichiesteQuery();
            var SintesiMezziMarkerquery = new SintesiMezziMarkerQuery();
            var SintesiRichiesteAssistenzaquery = new SintesiRichiesteAssistenzaQuery();
            var sintesiRichiesteAssistenzaMarkerQuery = new SintesiRichiesteAssistenzaMarkerQuery();
            var SintesiSediMarkerquery = new SintesiSediMarkerQuery();
            var Listaquery = new ListaChiamateInCorsoMarkerQuery();

            var welcome = new SO115App.Models.Classi.Condivise.Welcome()
            {
                BoxListaInterventi = this._BoxRichiestehandler.Handle(BoxRichiestequery).BoxRichieste,
                BoxListaMezzi = this._BoxMezzihandler.Handle(BoxMezziquery).BoxMezzi,
                BoxListaPersonale = this._BoxPersonalehandler.Handle(BoxPersonalequery).BoxPersonale,
                ListaChiamateInCorso = (List<ChiamateInCorso>)this._listaChiamateInCorsoMarkerhandler.Handle(Listaquery).ListaChiamateInCorsoMarker,
                ListaMezziMarker = (List<SintesiMezzoMarker>)this._SintesiMezziMarkerhandler.Handle(SintesiMezziMarkerquery).SintesiMezziMarker,
                ListaSintesi = (List<SintesiRichiesta>)this._SintesiRichiesteAssistenzahandler.Handle(SintesiRichiesteAssistenzaquery).SintesiRichiesta,
                ListaSediMarker = (List<SintesiSedeMarker>)this._SintesiSediMarkerhandler.Handle(SintesiSediMarkerquery).SintesiSediMarker,
                ListaRichiesteMarker = (List<SintesiRichiestaMarker>)this._SintesiRichiesteAssistenzaMarkerhandler.Handle(sintesiRichiesteAssistenzaMarkerQuery).SintesiRichiestaMarker
            };

            return new WelcomeResult()
            {
                WelcomeRes = welcome
            };
        }
    }
}
