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
        private readonly IGetChiamateInCorso _listaChiamateInCorsoMarkerHandler;
        private readonly IGetFiltri _filtriHandler;
        private readonly IGetListaDistaccamentiByPinListaSedi _getDistaccamenti;
        private readonly IGetAlberaturaUnitaOperative _getAlberaturaUnitaOperative;
        private readonly IGetZoneEmergenza _getZoneEmergenza;
        private readonly IGetRubrica _getRurbica;

        public WelcomeQueryHandler(IGetChiamateInCorso listaChiamateInCorsoMarkerHandler,
                                   IGetFiltri filtriHandler,
                                   IGetListaDistaccamentiByPinListaSedi getDistaccamenti,
                                   IGetAlberaturaUnitaOperative getAlberaturaUnitaOperative,
                                   IGetZoneEmergenza getZoneEmergenza,
                                   IGetRubrica getRurbica)
        {
            _listaChiamateInCorsoMarkerHandler = listaChiamateInCorsoMarkerHandler;
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

            foreach (var figlio in listaSediAlberate.Result.GetSottoAlbero(pinNodi))
                pinNodi.Add(new PinNodo(figlio.Codice, true));

            var filtri = _filtriHandler.Get();

            filtri.Distaccamenti = _getDistaccamenti.GetListaDistaccamenti();

            var listaChiamateInCorso = _listaChiamateInCorsoMarkerHandler.Get(pinNodi);
            var ListaZoneEmergenza = _getZoneEmergenza.GetAll();

            var welcome = new SO115App.Models.Classi.Condivise.Welcome()
            {
                ListaChiamateInCorso = listaChiamateInCorso,
                ListaFiltri = filtri,
                ZoneEmergenza = ListaZoneEmergenza,
                Rubrica = new List<SO115App.Models.Classi.RubricaDTO.EnteDTO>()
            };

            Log.Debug("Fine elaborazione Welcome Handler");

            return new WelcomeResult()
            {
                WelcomeRes = welcome
            };
        }
    }
}
