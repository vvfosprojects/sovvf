//-----------------------------------------------------------------------
// <copyright file="ListaSchedeContattoAuthorizationQueryHandlerDecorator.cs" company="CNVVF">
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
using System;
using System.Collections.Generic;
using System.Security.Principal;
using System.Text;
using CQRS.Authorization;
using CQRS.Queries.Authorizers;
using SO115App.API.Models.Classi.Autenticazione;
using SO115App.Models.Classi.Utility;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneSchedeNue.ListaSchedeContatto
{
    internal class ListaSchedeContattoAuthorizationQueryHandlerDecorator : IQueryAuthorizer<ListaSchedeContattoQuery, ListaSchedeContattoResult>
    {
        private readonly IPrincipal _currentUser;

        public ListaSchedeContattoAuthorizationQueryHandlerDecorator(IPrincipal currentUser)
        {
            _currentUser = currentUser;
        }

        public IEnumerable<AuthorizationResult> Authorize(ListaSchedeContattoQuery query)
        {
            var username = _currentUser.Identity.Name;

            if (_currentUser.Identity.IsAuthenticated)
            {
                var user = Utente.FindUserByUsername(username);
                if (user == null)
                    yield return new AuthorizationResult(Costanti.UtenteNonAutorizzato);
            }
            else
                yield return new AuthorizationResult(Costanti.UtenteNonAutorizzato);
        }
    }
}
