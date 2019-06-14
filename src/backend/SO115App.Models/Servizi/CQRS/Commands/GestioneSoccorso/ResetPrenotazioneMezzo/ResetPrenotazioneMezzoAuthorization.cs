using System.Collections.Generic;
using System.Security.Principal;
using CQRS.Authorization;
using CQRS.Commands.Authorizers;
using DomainModel.CQRS.Commands.MezzoPrenotato;
using SO115App.API.Models.Classi.Autenticazione;

namespace DomainModel.CQRS.Commands.ResetPrenotazioneMezzo
{
    public class ResetPrenotazioneMezzoAuthorization : ICommandAuthorizer<ResetPrenotazioneMezzoCommand>
    {

        private readonly IPrincipal currentUser;

        public ResetPrenotazioneMezzoAuthorization(IPrincipal currentUser)
        {
            this.currentUser = currentUser;
        }

        public IEnumerable<AuthorizationResult> Authorize(ResetPrenotazioneMezzoCommand command)
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
