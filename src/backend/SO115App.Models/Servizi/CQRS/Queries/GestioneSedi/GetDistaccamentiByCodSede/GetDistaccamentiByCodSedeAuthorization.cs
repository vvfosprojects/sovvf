using CQRS.Authorization;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.Autenticazione;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti.VerificaUtente;
using System.Collections.Generic;
using System.Security.Principal;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneSedi.GetDistaccamentiByCodSede
{
    public class GetDistaccamentiByCodSedeAuthorization
    {
        private readonly IPrincipal _currentUser;
        private readonly IFindUserByUsername _findUserByUsername;
        private readonly IGetAutorizzazioni _getAutorizzazioni;

        public GetDistaccamentiByCodSedeAuthorization(IPrincipal currentUser, IFindUserByUsername findUserByUsername, IGetAutorizzazioni getAutorizzazioni)
        {
            _currentUser = currentUser;
            _findUserByUsername = findUserByUsername;
            _getAutorizzazioni = getAutorizzazioni;
        }

        public IEnumerable<AuthorizationResult> Authorize(GetDistaccamentiByCodSedeQuery query)
        {
            string username = _currentUser.Identity.Name;
            var user = _findUserByUsername.FindUserByUs(username);

            if (_currentUser.Identity.IsAuthenticated)
            {
                if (user == null)
                    yield return new AuthorizationResult(Costanti.UtenteNonAutorizzato);
                else
                {
                    bool abilitato = false;
                    foreach (var competenza in query.CodiciSede)
                    {
                        if (_getAutorizzazioni.GetAutorizzazioniUtente(user.Ruoli, competenza, Costanti.GestoreRichieste))
                            abilitato = true;
                        if (_getAutorizzazioni.GetAutorizzazioniUtente(user.Ruoli, competenza, Costanti.GestoreChiamate))
                            abilitato = true;
                        if (_getAutorizzazioni.GetAutorizzazioniUtente(user.Ruoli, competenza, Costanti.Amministratore
                            ))
                            abilitato = true;
                    }

                    if (!abilitato)
                        yield return new AuthorizationResult(Costanti.UtenteNonAutorizzato);
                }
            }
            else
                yield return new AuthorizationResult(Costanti.UtenteNonAutorizzato);
        }
    }
}
