using CQRS.Authorization;
using CQRS.Queries.Authorizers;
using SO115App.API.Models.Classi.Autenticazione;
using SO115App.API.Models.Servizi.CQRS.Queries.Marker.SintesiSediMarker;
using System.Collections.Generic;
using System.Security.Principal;

namespace SO115App.API.Models.AOP.Authorization
{
    public class SintesiSediMarkerAuthorizationQueryHandlerDecorator : IQueryAuthorizer<SintesiSediMarkerQuery, SintesiSediMarkerResult>
    {
        private readonly IPrincipal currentUser;

        public IEnumerable<AuthorizationResult> Authorize(SintesiSediMarkerQuery query)
        {
            string username = this.currentUser.Identity.Name;

            if (this.currentUser.Identity.IsAuthenticated)
            {
                Utente user = Utente.FindUserByUsername(username);
                if (user == null)
                    yield return new AuthorizationResult("Utente non autorizzato");
            }
            else
                yield return new AuthorizationResult("Utente non autorizzato");
        }
    }
}