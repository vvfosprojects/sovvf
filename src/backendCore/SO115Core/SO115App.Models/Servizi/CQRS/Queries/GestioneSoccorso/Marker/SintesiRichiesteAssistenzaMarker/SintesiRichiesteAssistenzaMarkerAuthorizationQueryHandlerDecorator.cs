using System.Collections.Generic;
using System.Security.Principal;
using CQRS.Authorization;
using CQRS.Queries.Authorizers;
using SO115App.API.Models.Classi.Autenticazione;
using SO115App.API.Models.Servizi.CQRS.Queries.Marker.SintesiRichiesteAssistenzaMarker;

namespace SO115App.API.Models.AOP.Authorization
{
    public class SintesiRichiesteAssistenzaMarkerAuthorizationQueryHandlerDecorator<TQuery, TResult> : IQueryAuthorizer<SintesiRichiesteAssistenzaMarkerQuery, SintesiRichiesteAssistenzaMarkerResult>
    {
        private readonly IPrincipal currentUser;
        public IEnumerable<AuthorizationResult> Authorize(SintesiRichiesteAssistenzaMarkerQuery query)
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