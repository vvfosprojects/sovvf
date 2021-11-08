using CQRS.Authorization;
using CQRS.Queries.Authorizers;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GestioneTrasferimentiChiamate.CodiciChiamate;
using SO115App.Models.Servizi.Infrastruttura.Autenticazione;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti.VerificaUtente;
using System.Collections.Generic;
using System.Security.Principal;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GestioneTrasferimentiChiamate
{
    public class TrasferimentiChiamateAuthorizationQueryHandlerDecorator : IQueryAuthorizer<TrasferimentiChiamateQuery, TrasferimentiChiamateResult>
    {
        private readonly IPrincipal _currentUser;
        private readonly IFindUserByUsername _findUserByUsername;
        private readonly IGetAutorizzazioni _getAutorizzazioni;

        public TrasferimentiChiamateAuthorizationQueryHandlerDecorator(IPrincipal currentUser, IFindUserByUsername findUserByUsername, IGetAutorizzazioni getAutorizzazioni)
        {
            _currentUser = currentUser;
            _findUserByUsername = findUserByUsername;
            _getAutorizzazioni = getAutorizzazioni;
        }

        public IEnumerable<AuthorizationResult> Authorize(TrasferimentiChiamateQuery query)
        {
            var user = _findUserByUsername.FindUserByUs(_currentUser.Identity.Name);

            if (_currentUser.Identity.IsAuthenticated)
            {
                if (user == null)
                    yield return new AuthorizationResult(Costanti.UtenteNonAutorizzato);
                else
                {
                    bool autorizzato = false;
                    foreach (var sede in query.CodiciSede)
                    {
                        if (_getAutorizzazioni.GetAutorizzazioniUtente(user.Ruoli, sede, Costanti.GestoreRichieste))
                            autorizzato = true;
                    }

                    if (!autorizzato)
                        yield return new AuthorizationResult(Costanti.UtenteNonAutorizzato);
                }
            }
            else
                yield return new AuthorizationResult(Costanti.UtenteNonAutorizzato);
        }
    }
}
