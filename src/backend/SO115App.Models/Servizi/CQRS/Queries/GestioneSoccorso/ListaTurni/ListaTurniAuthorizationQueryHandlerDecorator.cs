using System.Collections.Generic;
using System.Security.Principal;
using CQRS.Authorization;
using CQRS.Queries.Authorizers;
using SO115App.API.Models.Classi.Autenticazione;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti.VerificaUtente;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.ListaTurni
{
    internal class ListaTurniAuthorizationQueryHandlerDecorator : IQueryAuthorizer<ListaTurniQuery, ListaTurniResult>
    {
        private readonly IPrincipal _currentUser;
        private readonly IFindUserByUsername _findUserByUsername;

        public ListaTurniAuthorizationQueryHandlerDecorator(IPrincipal currentUser, IFindUserByUsername findUserByUsername)
        {
            _currentUser = currentUser;
            _findUserByUsername = findUserByUsername;
        }

        public IEnumerable<AuthorizationResult> Authorize(ListaTurniQuery query)
        {
            var username = this._currentUser.Identity.Name;

            if (this._currentUser.Identity.IsAuthenticated)
            {
                var user = _findUserByUsername.FindUserByUs(username);
                if (user == null)
                    yield return new AuthorizationResult(Costanti.UtenteNonAutorizzato);
            }
            else
                yield return new AuthorizationResult(Costanti.UtenteNonAutorizzato);
        }
    }
}
