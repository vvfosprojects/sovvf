using CQRS.Authorization;
using CQRS.Commands.Authorizers;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneIntervento.InserisciRichiestaSoccorsoAereo;
using SO115App.Models.Servizi.Infrastruttura.Autenticazione;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti.VerificaUtente;
using System;
using System.Collections.Generic;
using System.Security.Principal;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneIntervento.AnnullaRichiestaSoccorsoAereo
{
    public class AnnullaRichiestaSoccorsoAereoAuthorizer : ICommandAuthorizer<InserisciRichiestaSoccorsoAereoCommand>
    {
        private readonly IPrincipal _currentUser;
        private readonly IFindUserByUsername _findUserByUsername;
        private readonly IGetAutorizzazioni _getAutorizzazioni;
        private readonly IGetRichiestaById _getRichiestaById;

        public AnnullaRichiestaSoccorsoAereoAuthorizer(
            IPrincipal currentUser,
            IFindUserByUsername findUserByUsername,
            IGetAutorizzazioni getAutorizzazioni,
            IGetRichiestaById getRichiestaById)
        {
            _currentUser = currentUser;
            _findUserByUsername = findUserByUsername;
            _getAutorizzazioni = getAutorizzazioni;
            _getRichiestaById = getRichiestaById;
        }

        public IEnumerable<AuthorizationResult> Authorize(InserisciRichiestaSoccorsoAereoCommand command)
        {
            command.Richiesta = _getRichiestaById.GetByCodice(command.RichiestaSoccorsoAereo.RequestKey);

            var Utente = _findUserByUsername.FindUserByUs(_currentUser.Identity.Name);

            if (_currentUser.Identity.IsAuthenticated)
            {
                if (Utente == null)
                    yield return new AuthorizationResult(Costanti.UtenteNonAutorizzato);
                else
                {
                    bool abilitato = false;
                    foreach (var competenza in command.Richiesta.CodUOCompetenza)
                    {
                        if (_getAutorizzazioni.GetAutorizzazioniUtente(Utente.Ruoli, competenza, Costanti.GestoreRichieste))
                            abilitato = true;
                    }

                    if (command.Richiesta.CodSOAllertate != null)
                    {
                        foreach (var competenza in command.Richiesta.CodSOAllertate)
                        {
                            if (_getAutorizzazioni.GetAutorizzazioniUtente(Utente.Ruoli, competenza, Costanti.GestoreRichieste))
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
