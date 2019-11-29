using CQRS.Authorization;
using CQRS.Queries.Authorizers;
using SO115App.API.Models.Classi.Autenticazione;
using SO115App.Models.Classi.Utility;
using System;
using System.Collections.Generic;
using System.Security.Principal;
using System.Text;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneSchedeNue.GetSchedeContatto
{
    internal class GetSchedeContattoAuthorizationQueryHandlerDecorator : IQueryAuthorizer<GetSchedeContattoQuery, GetSchedeContattoResult>
    {
        private readonly IPrincipal _currentUser;

        public GetSchedeContattoAuthorizationQueryHandlerDecorator(IPrincipal currentUser)
        {
            _currentUser = currentUser;
        }

        public IEnumerable<AuthorizationResult> Authorize(GetSchedeContattoQuery query)
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
