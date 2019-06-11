using System.Collections.Generic;
using System.Security.Principal;
using CQRS.Authorization;
using CQRS.Commands.Authorizers;
using SO115App.API.Models.Classi.Autenticazione;

namespace DomainModel.CQRS.Commands.AddIntervento
{
    public class MezzoPrenotatoAuthorization : ICommandAuthorizer<AddInterventoCommand>
    {

        private readonly IPrincipal currentUser;

        public MezzoPrenotatoAuthorization(IPrincipal currentUser)
        {
            this.currentUser = currentUser;
        }

        public IEnumerable<AuthorizationResult> Authorize(AddInterventoCommand command)
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
