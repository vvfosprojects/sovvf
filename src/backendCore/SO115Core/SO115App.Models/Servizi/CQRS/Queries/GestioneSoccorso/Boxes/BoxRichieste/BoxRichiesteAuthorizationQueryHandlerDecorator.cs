using CQRS.Authorization;
using CQRS.Queries.Authorizers;
using SO115App.API.Models.Classi.Autenticazione;
using System.Collections.Generic;
using System.Security.Principal;

namespace SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Boxes
{
    public class BoxRichiesteAuthorizationQueryHandlerDecorator : IQueryAuthorizer<BoxRichiesteQuery, BoxRichiesteResult>
    {
        private readonly IPrincipal currentUser;

        public IEnumerable<AuthorizationResult> Authorize(BoxRichiesteQuery query)
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