using System.Collections.Generic;
using System.Security.Principal;
using CQRS.Authorization;
using CQRS.Commands.Authorizers;
using DomainModel.CQRS.Commands.MezzoPrenotato;
using SO115App.API.Models.Classi.Autenticazione;
using SO115App.Models.Classi.Utility;

namespace DomainModel.CQRS.Commands.SbloccaMezzoPrenotato
{
    public class SbloccaMezzoPrenotatoAuthorization : ICommandAuthorizer<SbloccaMezzoPrenotatoCommand>
    {

        private readonly IPrincipal _currentUser;

        public SbloccaMezzoPrenotatoAuthorization(IPrincipal currentUser)
        {
            this._currentUser = currentUser;
        }

        public IEnumerable<AuthorizationResult> Authorize(SbloccaMezzoPrenotatoCommand command)
        {
            var username = this._currentUser.Identity.Name;
            var user = Utente.FindUserByUsername(username);

            if (_currentUser.Identity.IsAuthenticated)
            {
                
                if (user == null)
                    yield return new AuthorizationResult(Costanti.UtenteNonAutorizzato);
            }
            else
                yield return new AuthorizationResult(Costanti.UtenteNonAutorizzato);

        }
    }
}
