using CQRS.Authorization;
using CQRS.Commands.Authorizers;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.Autenticazione;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti.VerificaUtente;
using System.Collections.Generic;
using System.Security.Principal;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneConcorrenza.DeleteAllBlocks
{
    public class DeleteAllBlocksAuthorization : ICommandAuthorizer<DeleteAllBlocksCommand>
    {
        private readonly IPrincipal _currentUser;
        private readonly IFindUserByUsername _findUserByUsername;
        private readonly IGetAutorizzazioni _getAutorizzazioni;

        public DeleteAllBlocksAuthorization(
            IPrincipal currentUser,
            IFindUserByUsername findUserByUsername,
            IGetAutorizzazioni getAutorizzazioni)
        {
            _currentUser = currentUser;
            _findUserByUsername = findUserByUsername;
            _getAutorizzazioni = getAutorizzazioni;
        }

        public IEnumerable<AuthorizationResult> Authorize(DeleteAllBlocksCommand command)
        {
            command.utente = _findUserByUsername.FindUserByUs(_currentUser.Identity.Name);

            if (_currentUser.Identity.IsAuthenticated)
            {
                if (command.utente == null)
                    yield return new AuthorizationResult(Costanti.UtenteNonAutorizzato);
                else
                {
                    bool abilitato = false;
                    if (_getAutorizzazioni.GetAutorizzazioniUtente(command.utente.Ruoli, command.CodiceSede, Costanti.GestoreRichieste))
                        abilitato = true;

                    if (_getAutorizzazioni.GetAutorizzazioniUtente(command.utente.Ruoli, command.CodiceSede, Costanti.GestoreChiamate))
                        abilitato = true;

                    if (!abilitato)
                        yield return new AuthorizationResult(Costanti.UtenteNonAutorizzato);
                }
            }
            else
                yield return new AuthorizationResult(Costanti.UtenteNonAutorizzato);
        }
    }
}
