using CQRS.Authorization;
using CQRS.Queries.Authorizers;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.Autenticazione;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti.VerificaUtente;
using System.Collections.Generic;
using System.Security.Principal;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GetCodiciRichiesteAssistenza
{
    public class GetCodiciRichiesteAssistenzaAuthorizationQueryHandlerDecorator : IQueryAuthorizer<GetCodiciRichiesteAssistenzaQuery, GetCodiciRichiesteAssistenzaResult>
    {
        private readonly IPrincipal _currentUser;
        private readonly IFindUserByUsername _findUserByUsername;

        public GetCodiciRichiesteAssistenzaAuthorizationQueryHandlerDecorator(IPrincipal currentUser, IFindUserByUsername findUserByUsername)
        {
            _currentUser = currentUser;
            _findUserByUsername = findUserByUsername;
        }

        public IEnumerable<AuthorizationResult> Authorize(GetCodiciRichiesteAssistenzaQuery query)
        {
            var username = this._currentUser.Identity.Name;
            var user = _findUserByUsername.FindUserByUs(username);

            if (this._currentUser.Identity.IsAuthenticated)
            {
                if (user == null)
                    yield return new AuthorizationResult(Costanti.UtenteNonAutorizzato);
            }
            else
                yield return new AuthorizationResult(Costanti.UtenteNonAutorizzato);
        }
    }
}
