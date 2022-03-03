using CQRS.Authorization;
using CQRS.Commands.Authorizers;
using SO115App.Models.Classi.Concorrenza;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.Autenticazione;
using SO115App.Models.Servizi.Infrastruttura.GestioneConcorrenza;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti.VerificaUtente;
using System.Collections.Generic;
using System.Security.Principal;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneConcorrenza.AddBlock
{
    public class AddBlockAuthorization : ICommandAuthorizer<AddBlockCommand>
    {
        private readonly IPrincipal _currentUser;
        private readonly IFindUserByUsername _findUserByUsername;
        private readonly IGetAutorizzazioni _getAutorizzazioni;
        private readonly IGetBlockByValue _getBlockByValue;

        public AddBlockAuthorization(
            IPrincipal currentUser,
            IFindUserByUsername findUserByUsername,
            IGetAutorizzazioni getAutorizzazioni,
            IGetBlockByValue getBlockByValue)
        {
            _currentUser = currentUser;
            _findUserByUsername = findUserByUsername;
            _getAutorizzazioni = getAutorizzazioni;
            _getBlockByValue = getBlockByValue;
        }

        public IEnumerable<AuthorizationResult> Authorize(AddBlockCommand command)
        {
            command.utente = _findUserByUsername.FindUserByUs(_currentUser.Identity.Name);

            if (_getBlockByValue.Get(command.concorrenza.Value) != null)
            {
                if (command.concorrenza.Type.Equals(TipoOperazione.Richiesta))
                    yield return new AuthorizationResult(Costanti.InterventoBloccato);
                if (command.concorrenza.Type.Equals(TipoOperazione.Mezzo))
                    yield return new AuthorizationResult(Costanti.MezzoPrenotato);
                if (command.concorrenza.Type.Equals(TipoOperazione.Squadra))
                    yield return new AuthorizationResult(Costanti.SquadraPrenotata);
            }

            if (_currentUser.Identity.IsAuthenticated)
            {
                if (command.utente == null)
                    yield return new AuthorizationResult(Costanti.UtenteNonAutorizzato);
                else
                {
                    bool abilitato = false;
                    if (_getAutorizzazioni.GetAutorizzazioniUtente(command.utente.Ruoli, command.concorrenza.CodComando, Costanti.GestoreRichieste))
                        abilitato = true;

                    if (_getAutorizzazioni.GetAutorizzazioniUtente(command.utente.Ruoli, command.concorrenza.CodComando, Costanti.GestoreChiamate))
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
