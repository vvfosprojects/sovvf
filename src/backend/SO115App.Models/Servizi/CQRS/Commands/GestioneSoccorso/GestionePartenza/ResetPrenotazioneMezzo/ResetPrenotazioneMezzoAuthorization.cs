using System.Collections.Generic;
using System.Security.Principal;
using CQRS.Authorization;
using CQRS.Commands.Authorizers;
using DomainModel.CQRS.Commands.MezzoPrenotato;
using SO115App.API.Models.Classi.Autenticazione;
using SO115App.Models.Classi.Utility;

namespace DomainModel.CQRS.Commands.ResetPrenotazioneMezzo
{
    public class ResetPrenotazioneMezzoAuthorization : ICommandAuthorizer<ResetPrenotazioneMezzoCommand>
    {

        private readonly IPrincipal _currentUser;
        private readonly Costanti _costanti = new Costanti();

        public ResetPrenotazioneMezzoAuthorization(IPrincipal currentUser)
        {
            this._currentUser = currentUser;
        }

        public IEnumerable<AuthorizationResult> Authorize(ResetPrenotazioneMezzoCommand command)
        {
            var username = this._currentUser.Identity.Name;
            var user = Utente.FindUserByUsername(username);

            if (_currentUser.Identity.IsAuthenticated)
            {

                if (user == null)
                    yield return new AuthorizationResult(_costanti.UtenteNonAutorizzato);
            }
            else
                yield return new AuthorizationResult(_costanti.UtenteNonAutorizzato);

        }
    }
}
