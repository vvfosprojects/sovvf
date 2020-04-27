//-----------------------------------------------------------------------
// <copyright file="BoxPersonaleQueryHandler.cs" company="CNVVF">
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
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Boxes;
using SO115App.Models.Servizi.Infrastruttura.Box;

namespace SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.DisponibilitaPersonale
{
    /// <summary>
    ///   Servizio che restituisce tutti i valori dei Box presenti in HomePage.
    /// </summary>
    public class BoxPersonaleQueryHandler : IQueryHandler<BoxPersonaleQuery, BoxPersonaleResult>
    {
        private readonly IGetBoxPersonale _iGetBox;

        public BoxPersonaleQueryHandler(IGetBoxPersonale iGetBox)
        {
            this._iGetBox = iGetBox;
        }

        /// <summary>
        ///   Query che estrae i valori dei Box presenti in Home Page
        /// </summary>
        /// <param name="query">Filtri utilizzati per l'estrazione</param>
        /// <returns>Elenco dei mezzi disponibili</returns>
        public BoxPersonaleResult Handle(BoxPersonaleQuery query)
        {
            Log.Debug("Inizio elaborazione Box Personale Handler");

            // preparazione del DTO
            var boxes = _iGetBox.Get(query.CodiciSede);

            Log.Debug("Fine elaborazione Box Personale Handler");

            return new BoxPersonaleResult()
            {
                BoxPersonale = boxes
            };
        }
    }
}
