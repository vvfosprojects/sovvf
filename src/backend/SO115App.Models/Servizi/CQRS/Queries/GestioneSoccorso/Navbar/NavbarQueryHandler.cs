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
using Microsoft.Extensions.Configuration;
using Serilog;
using SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.Utility;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti;
using SO115App.Models.Servizi.Infrastruttura.Marker;
using SO115App.Models.Servizi.Infrastruttura.Notification.CallESRI;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using System.Linq;

namespace SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Navbar
{
    /// <summary>
    ///   Servizio che restituisce tutti i valori della Navbar.
    /// </summary>
    public class NavbarQueryHandler : IQueryHandler<NavbarQuery, NavbarResult>
    {
        private readonly IGetAlberaturaUnitaOperative _alberaturaUO;
        private readonly IGetUtenteById _getUtenteById;
        private readonly IGetCentroMappaMarker _centroMappaMarkerHandler;
        private readonly IConfiguration _configuration;
        private readonly IGetConteggioSchede _getConteggioSchedeHandler;

        public NavbarQueryHandler(IGetAlberaturaUnitaOperative alberaturaUO,
                                  IGetConteggioSchede getConteggioSchedeHandler,
                                  IGetUtenteById getUtenteById,
                                  IGetCentroMappaMarker centroMappaMarkerHandler,
                                  IConfiguration configuration)
        {
            _alberaturaUO = alberaturaUO;
            _getConteggioSchedeHandler = getConteggioSchedeHandler;
            _getUtenteById = getUtenteById;
            _centroMappaMarkerHandler = centroMappaMarkerHandler;
            _configuration = configuration;
        }

        /// <summary>
        ///   Query che estrae i valori dei Box presenti in Home Page
        /// </summary>
        /// <param name="query">Filtri utilizzati per l'estrazione</param>
        /// <returns>Elenco dei mezzi disponibili</returns>
        public NavbarResult Handle(NavbarQuery query)
        {
            Log.Debug("Inizio elaborazione Informazioni Navbar Handler");

            var centroMappaMarker = _centroMappaMarkerHandler.GetCentroMappaMarker(query.CodSedi[0]);
            var lstSedi = _alberaturaUO.ListaSediAlberata();

            var navbars = new Classi.NavBar.Navbar
            {
                ListaSedi = lstSedi,
                Utente = _getUtenteById.GetUtenteByCodice(query.IdUtente),
                infoNue = _getConteggioSchedeHandler.GetConteggio(query.CodSedi),
                CentroMappaMarker = centroMappaMarker,
                UserESRI = _configuration.GetSection("ESRI").GetSection("User").Value,
                PwESRI = _configuration.GetSection("ESRI").GetSection("Password").Value
            };

            Log.Debug("Fine elaborazione Informazioni Navbar Handler");

            return new NavbarResult()
            {
                Navbar = navbars
            };
        }
    }
}
