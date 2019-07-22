//-----------------------------------------------------------------------
// <copyright file="NavbarAuthorizationQueryHandlerDecorator.cs" company="CNVVF">
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
using System.Collections.Generic;
using System.Security.Principal;
using CQRS.Authorization;
using CQRS.Queries.Authorizers;
using SO115App.API.Models.Classi.Autenticazione;
using SO115App.Models.Classi.Utility;

namespace SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Welcome
{
    public class WelcomeAuthorizationQueryHandlerDecorator : IQueryAuthorizer<WelcomeQuery, WelcomeResult>
    {
        private readonly IPrincipal _currentUser;
        private readonly Costanti _costanti;

        public WelcomeAuthorizationQueryHandlerDecorator(IPrincipal currentUser)
        {
            this._currentUser = currentUser;
        }

        public IEnumerable<AuthorizationResult> Authorize(WelcomeQuery query)
        {
            var username = this._currentUser.Identity.Name;
            var user = Utente.FindUserByUsername(username);

            if (this._currentUser.Identity.IsAuthenticated)
            {
                if (user == null)
                    yield return new AuthorizationResult(_costanti.UtenteNonAutorizzato);
            }
            else
                yield return new AuthorizationResult(_costanti.UtenteNonAutorizzato);
        }
    }
}
