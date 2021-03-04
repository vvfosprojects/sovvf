﻿//-----------------------------------------------------------------------
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
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti.GestioneRuolo;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;

namespace SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Navbar
{
    /// <summary>
    ///   Servizio che restituisce tutti i valori della Navbar.
    /// </summary>
    public class NavbarQueryHandler : IQueryHandler<NavbarQuery, NavbarResult>
    {
        private readonly IGetAlberaturaUnitaOperative _alberaturaUO;
        private readonly IGetRuoliById _getRuoliById;
        private readonly IGetUtenteById _getUtenteById;
        private readonly IGetConteggioSchede _getConteggioSchedeHandler;

        public NavbarQueryHandler(IGetAlberaturaUnitaOperative alberaturaUO, IGetRuoliById getRuoliById,
                                  IGetConteggioSchede getConteggioSchedeHandler, IGetUtenteById getUtenteById)
        {
            this._alberaturaUO = alberaturaUO;
            _getRuoliById = getRuoliById;
            _getConteggioSchedeHandler = getConteggioSchedeHandler;
            _getUtenteById = getUtenteById;
        }

        /// <summary>
        ///   Query che estrae i valori dei Box presenti in Home Page
        /// </summary>
        /// <param name="query">Filtri utilizzati per l'estrazione</param>
        /// <returns>Elenco dei mezzi disponibili</returns>
        public NavbarResult Handle(NavbarQuery query)
        {
            Log.Debug("Inizio elaborazione Informazioni Navbar Handler");

            var navbars = new SO115App.API.Models.Classi.NavBar.Navbar
            {
                ListaSedi = _alberaturaUO.ListaSediAlberata(),
                Utente = _getUtenteById.GetUtenteByCodice(query.IdUtente),
                infoNue = _getConteggioSchedeHandler.GetConteggio(query.CodSedi)
            };

            Log.Debug("Fine elaborazione Informazioni Navbar Handler");

            return new NavbarResult()
            {
                Navbar = navbars
            };
        }
    }
}
