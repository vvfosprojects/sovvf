using System.Collections.Generic;
using System.Security.Principal;
using CQRS.Authorization;
using CQRS.Commands.Authorizers;
using DomainModel.CQRS.Commands.ConfermaPartenze;
using DomainModel.CQRS.Commands.MezzoPrenotato;
using SO115App.API.Models.Classi.Autenticazione;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.Autenticazione;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti.VerificaUtente;

namespace DomainModel.CQRS.Commands.MezzoPrenotato
{
    public class ConfermaPartenzeAuthorization : ICommandAuthorizer<ConfermaPartenzeCommand>
    {
        private readonly IPrincipal _currentUser;
        private readonly IFindUserByUsername _findUserByUsername;
        private readonly IGetAutorizzazioni _getAutorizzazioni;

        public ConfermaPartenzeAuthorization(IPrincipal currentUser, IFindUserByUsername findUserByUsername, IGetAutorizzazioni getAutorizzazioni)
        {
            this._currentUser = currentUser;
            _findUserByUsername = findUserByUsername;
            _getAutorizzazioni = getAutorizzazioni;
        }

        public IEnumerable<AuthorizationResult> Authorize(ConfermaPartenzeCommand command)
        {
            var username = _currentUser.Identity.Name;
            var user = _findUserByUsername.FindUserByUs(username);

            if (_currentUser.Identity.IsAuthenticated)
            {
                if (user == null)
                    yield return new AuthorizationResult(Costanti.UtenteNonAutorizzato);
                else
                {
                    foreach (var ruolo in user.Ruoli)
                    {
                        if (!_getAutorizzazioni.GetAutorizzazioniUtente(user.Ruoli, command.ConfermaPartenze.CodiceSede, Costanti.GestoreRichieste))
                            yield return new AuthorizationResult(Costanti.UtenteNonAutorizzato);
                    }
                }
            }
            else
                yield return new AuthorizationResult(Costanti.UtenteNonAutorizzato);
        }
    }
}
