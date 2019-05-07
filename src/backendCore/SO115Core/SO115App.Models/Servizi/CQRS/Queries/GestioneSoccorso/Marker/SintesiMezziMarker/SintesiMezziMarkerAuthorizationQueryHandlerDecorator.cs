using System.Collections.Generic;
using System.Security.Principal;
using CQRS.Authorization;
using CQRS.Queries.Authorizers;
using SO115App.API.Models.Classi.Autenticazione;

namespace SO115App.API.Models.Servizi.CQRS.Queries.Marker.SintesiMezziMarker
{
    public class SintesiMezziMarkerAuthorizationQueryHandlerDecorator : IQueryAuthorizer<SintesiMezziMarkerQuery, SintesiMezziMarkerResult>
    {
        private readonly IPrincipal currentUser;

        public IEnumerable<AuthorizationResult> Authorize(SintesiMezziMarkerQuery query)
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