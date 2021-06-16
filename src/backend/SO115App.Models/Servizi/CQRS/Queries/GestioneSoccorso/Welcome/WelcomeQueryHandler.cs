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
using SO115App.Models.Servizi.Infrastruttura.Box;
using SO115App.Models.Servizi.Infrastruttura.GestioneRubrica.Enti;
using SO115App.Models.Servizi.Infrastruttura.GestioneZoneEmergenza;
using SO115App.Models.Servizi.Infrastruttura.GetFiltri;
using SO115App.Models.Servizi.Infrastruttura.Marker;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
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
        private readonly IGetAlberaturaUnitaOperative _getAlberaturaUnitaOperative;
        private readonly IGetZoneEmergenza _getZoneEmergenza;
        private readonly IGetRubrica _getRurbica;

        public WelcomeQueryHandler(IGetBoxMezzi boxMezziHandler,
            IGetBoxPersonale boxPersonaleHandler,
            IGetBoxRichieste boxRichiesteHandler,
            IGetChiamateInCorso listaChiamateInCorsoMarkerHandler,
            IGetCentroMappaMarker centroMappaMarkerHandler,
            IGetFiltri filtriHandler,
            IGetListaDistaccamentiByPinListaSedi getDistaccamenti,
            IGetAlberaturaUnitaOperative getAlberaturaUnitaOperative,
            IGetZoneEmergenza getZoneEmergenza,
            IGetRubrica getRurbica)
        {
            _boxMezziHandler = boxMezziHandler;
            _boxPersonaleHandler = boxPersonaleHandler;
            _boxRichiesteHandler = boxRichiesteHandler;
            _listaChiamateInCorsoMarkerHandler = listaChiamateInCorsoMarkerHandler;
            _centroMappaMarkerHandler = centroMappaMarkerHandler;
            _filtriHandler = filtriHandler;
            _getDistaccamenti = getDistaccamenti;
            _getAlberaturaUnitaOperative = getAlberaturaUnitaOperative;
            _getRurbica = getRurbica;
            _getZoneEmergenza = getZoneEmergenza;
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
                pinNodi.Add(new PinNodo(figlio.Codice, true));

            var boxListaInterventi = Task.Factory.StartNew(() => _boxRichiesteHandler.Get(pinNodi.ToHashSet()));
            var boxListaMezzi = Task.Factory.StartNew(() => _boxMezziHandler.Get(pinNodi.Select(p => p.Codice).ToArray()));
            var boxListaPersonale = Task.Factory.StartNew(() => _boxPersonaleHandler.Get(pinNodi.Select(p => p.Codice).ToArray()));

            var filtri = _filtriHandler.Get();

            if (query.CodiceSede[0].Equals("CON"))
                filtri.Distaccamenti = _getDistaccamenti.GetListaDistaccamenti(pinNodi.ToHashSet().ToList());
            else
                filtri.Distaccamenti = _getDistaccamenti.GetListaDistaccamenti(pinNodiNoDistaccamenti);

            var listaChiamateInCorso = Task.Factory.StartNew(() => _listaChiamateInCorsoMarkerHandler.Get(pinNodi));
            var centroMappaMarker = Task.Factory.StartNew(() => _centroMappaMarkerHandler.GetCentroMappaMarker(query.CodiceSede[0]));

            var rubrica = Task.Factory.StartNew(() => _getRurbica.Get(pinNodi.Select(n => n.Codice).ToArray()));

            var ListaZoneEmergenza = Task.Factory.StartNew(() => _getZoneEmergenza.GetAll());

            var welcome = new SO115App.Models.Classi.Condivise.Welcome()
            {
                ListaChiamateInCorso = listaChiamateInCorso.Result,
                CentroMappaMarker = centroMappaMarker.Result,
                ListaFiltri = filtri,
                ZoneEmergenza = ListaZoneEmergenza.Result,
                Rubrica = rubrica.Result,
                BoxListaInterventi = boxListaInterventi.Result,
                BoxListaMezzi = boxListaMezzi.Result,
                BoxListaPersonale = boxListaPersonale.Result
            };            

            Log.Debug("Fine elaborazione Welcome Handler");

            return new WelcomeResult()
            {
                WelcomeRes = welcome
            };
        }
    }
}
