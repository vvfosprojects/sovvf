using CQRS.Authorization;
using CQRS.Queries.Authorizers;
using SO115App.API.Models.Classi.Autenticazione;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti.VerificaUtente;
using System.Collections.Generic;
using System.Security.Principal;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneTrasferimentiChiamate.CodiciChiamate
{
    public class TrasferimentiChiamateAuthorizationQueryHandlerDecorator : IQueryAuthorizer<TrasferimentiChiamateQuery, TrasferimentiChiamateResult>
    {
        private readonly IPrincipal _currentUser;
        private readonly IFindUserByUsername _findUserByUsername;

        public TrasferimentiChiamateAuthorizationQueryHandlerDecorator(IPrincipal currentUser, IFindUserByUsername findUserByUsername)
        {
            this._currentUser = currentUser;
            _findUserByUsername = findUserByUsername;
        }

        public IEnumerable<AuthorizationResult> Authorize(TrasferimentiChiamateQuery query)
        {
            string username = this._currentUser.Identity.Name;
            Utente user = _findUserByUsername.FindUserByUs(username);

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

