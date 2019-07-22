using System.Collections.Generic;
using System.Security.Principal;
using CQRS.Authorization;
using CQRS.Commands.Authorizers;
using DomainModel.CQRS.Commands.MezzoPrenotato;
using SO115App.API.Models.Classi.Autenticazione;
using SO115App.Models.Classi.Utility;

namespace DomainModel.CQRS.Commands.MezzoPrenotato
{
    public class MezzoPrenotatoAuthorization : ICommandAuthorizer<MezzoPrenotatoCommand>
    {

        private readonly IPrincipal currentUser;
        private readonly Costanti _costanti;

        public MezzoPrenotatoAuthorization(IPrincipal currentUser)
        {
            this.currentUser = currentUser;
        }

        public IEnumerable<AuthorizationResult> Authorize(MezzoPrenotatoCommand command)
        {
            var username = this.currentUser.Identity.Name;

            if (this.currentUser.Identity.IsAuthenticated)
            {
                var user = Utente.FindUserByUsername(username);
                if (user == null)
                    yield return new AuthorizationResult(_costanti.UtenteNonAutorizzato);
            }
            else
                yield return new AuthorizationResult(_costanti.UtenteNonAutorizzato);

        }
    }
}
