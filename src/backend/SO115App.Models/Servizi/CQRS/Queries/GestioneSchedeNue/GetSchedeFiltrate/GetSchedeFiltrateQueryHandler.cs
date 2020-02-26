//-----------------------------------------------------------------------
// <copyright file="ListaSchedeContattoQueryHandler.cs" company="CNVVF">
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
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue;
using System.Linq;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneSchedeNue.GetSchedeFiltrate
{
    internal class GetSchedeFiltrateQueryHandler : IQueryHandler<GetSchedeFiltrateQuery, GetSchedeFiltrateResult>
    {
        private readonly IGetSchedeFiltrate _getSchedeFiltrate;
        private readonly IGetUtenteById _getUtenteBy;

        public GetSchedeFiltrateQueryHandler(IGetSchedeFiltrate getSchedeFiltrate, IGetUtenteById getUtenteBy)
        {
            _getSchedeFiltrate = getSchedeFiltrate;
            _getUtenteBy = getUtenteBy;
        }

        public GetSchedeFiltrateResult Handle(GetSchedeFiltrateQuery query)
        {
            string codiceFiscale = null;
            if (query.Filtro.CercaPerOperatore == true)
            {
                var utente = _getUtenteBy.GetUtenteByCodice(query.Filtro.IdUtente);
                codiceFiscale = utente.CodiceFiscale;
            }

            var listaSchedeContatto = _getSchedeFiltrate.Get(query.Filtro.TestoLibero, query.Filtro.Gestita, codiceFiscale, query.Filtro.RangeVisualizzazione, query.CodiceSede).OrderByDescending(x => !x.Gestita).ThenByDescending(x => x.Priorita).ThenBy(x => x.DataInserimento).ToList();

            return new GetSchedeFiltrateResult()
            {
                SchedeContatto = listaSchedeContatto
            };
        }
    }
}
