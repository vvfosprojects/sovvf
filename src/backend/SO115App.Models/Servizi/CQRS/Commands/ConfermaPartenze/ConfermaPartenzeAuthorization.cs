using CQRS.Authorization;
using CQRS.Commands.Authorizers;
using DomainModel.CQRS.Commands.ConfermaPartenze;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.Autenticazione;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti.VerificaUtente;
using System.Collections.Generic;
using System.Security.Principal;

namespace DomainModel.CQRS.Commands.MezzoPrenotato
{
    public class ConfermaPartenzeAuthorization : ICommandAuthorizer<ConfermaPartenzeCommand>
    {
        private readonly IPrincipal _currentUser;
        private readonly IFindUserByUsername _findUserByUsername;
        private readonly IGetAutorizzazioni _getAutorizzazioni;
        private readonly IGetRichiesta _getRichiestaById;

        public ConfermaPartenzeAuthorization(
            IPrincipal currentUser,
            IFindUserByUsername findUserByUsername,
            IGetAutorizzazioni getAutorizzazioni,
            IGetRichiesta getRichiestaById)
        {
            _currentUser = currentUser;
            _findUserByUsername = findUserByUsername;
            _getAutorizzazioni = getAutorizzazioni;
            _getRichiestaById = getRichiestaById;
        }

        public IEnumerable<AuthorizationResult> Authorize(ConfermaPartenzeCommand command)
        {
            command.Richiesta = _getRichiestaById.GetByCodice(command.ConfermaPartenze.IdRichiesta);
            command.Utente = _findUserByUsername.FindUserByUs(_currentUser.Identity.Name);

            if (_currentUser.Identity.IsAuthenticated)
            {
                if (command.Utente == null)
                    yield return new AuthorizationResult(Costanti.UtenteNonAutorizzato);
                else
                {
                    bool abilitato = false;
                    foreach (var competenza in command.Richiesta.CodUOCompetenza)
                    {
                        if (_getAutorizzazioni.GetAutorizzazioniUtente(command.Utente.Ruoli, competenza, Costanti.GestoreRichieste))
                            abilitato = true;
                    }

                    if (command.Richiesta.CodSOAllertate != null)
                    {
                        foreach (var competenza in command.Richiesta.CodSOAllertate)
                        {
                            if (_getAutorizzazioni.GetAutorizzazioniUtente(command.Utente.Ruoli, competenza, Costanti.GestoreRichieste))
                                abilitato = true;
                        }
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
