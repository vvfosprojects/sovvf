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
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti;
using SO115App.Models.Servizi.Infrastruttura.Marker;
using SO115App.Models.Servizi.Infrastruttura.Notification.CallESRI;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using System.Linq;

namespace SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.RicercaFullText
{
    /// <summary>
    ///   Servizio che restituisce tutti i valori della Navbar.
    /// </summary>
    public class RicercaFullTextQueryHandler : IQueryHandler<RicercaFullTextQuery, RicercaFullTextResult>
    {
        private readonly IRicercaFullText _ricercaFullText;

        public RicercaFullTextQueryHandler(IRicercaFullText ricercaFullText)
        {
            _ricercaFullText = ricercaFullText;
        }

        /// <summary>
        ///   Query che estrae i valori dei Box presenti in Home Page
        /// </summary>
        /// <param name="query">Filtri utilizzati per l'estrazione</param>
        /// <returns>Elenco dei mezzi disponibili</returns>
        public RicercaFullTextResult Handle(RicercaFullTextQuery query)
        {
            Log.Debug("Inizio elaborazione ricerca Full Text");

            var listaRichieste = _ricercaFullText.GetListaSintesi(query.CodSedi,query.TextSearch);

            Log.Debug("Fine elaborazione ricerca Full Text");

            return new RicercaFullTextResult()
            {
                ListaSintesi = listaRichieste
            };
        }
    }
}
