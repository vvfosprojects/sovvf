using CQRS.Authorization;
using CQRS.Commands.Authorizers;
using SO115App.Models.Classi.Concorrenza;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.Autenticazione;
using SO115App.Models.Servizi.Infrastruttura.GestioneConcorrenza;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti.VerificaUtente;
using SO115App.Models.Servizi.Infrastruttura.Utility;
using System.Collections.Generic;
using System.Security.Principal;
using System.Threading.Tasks;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneConcorrenza.AddBlock
{
    public class AddBlockAuthorization : ICommandAuthorizer<AddBlockCommand>
    {
        private readonly IPrincipal _currentUser;
        private readonly IFindUserByUsername _findUserByUsername;
        private readonly IGetAutorizzazioni _getAutorizzazioni;
        private readonly IGetBlockByValue _getBlockByValue;
        private readonly IGetSottoSediByCodSede _getSottoSediByCodSede;
        private readonly IIsActionFree _isActionFree;

        public AddBlockAuthorization(
            IPrincipal currentUser,
            IFindUserByUsername findUserByUsername,
            IGetAutorizzazioni getAutorizzazioni,
            IGetBlockByValue getBlockByValue,
            IGetSottoSediByCodSede getSottoSediByCodSede,
            IIsActionFree isActionFree)
        {
            _currentUser = currentUser;
            _findUserByUsername = findUserByUsername;
            _getAutorizzazioni = getAutorizzazioni;
            _getBlockByValue = getBlockByValue;
            _getSottoSediByCodSede = getSottoSediByCodSede;
            _isActionFree = isActionFree;
        }

        public IEnumerable<AuthorizationResult> Authorize(AddBlockCommand command)
        {
            command.utente = _findUserByUsername.FindUserByUs(_currentUser.Identity.Name);
            
            #region Concorrenza

            //Controllo Concorrenza
            var listaSediInteressate = _getSottoSediByCodSede.Get(new string[1] { command.CodComando });

            bool isFree = true;
            Parallel.ForEach(command.concorrenza, concorrenza =>
            {
              concorrenza.NominativoOperatore = command.utente.Nome + " " + command.utente.Cognome;
              if (!_isActionFree.Check(concorrenza.Type, command.utente.Id, listaSediInteressate.ToArray(), concorrenza.Value))
                    isFree = false;
            });

            if (!isFree)
                yield return new AuthorizationResult($"In questo momento l'intervento risulta occupato da un altro operatore. L'operazione non può essere eseguita");

            #endregion Concorrenza

            //foreach (var c in command.concorrenza)
            //{
            //    c.NominativoOperatore = command.utente.Nome + " " + command.utente.Cognome;

            //    if (_getBlockByValue.Get(c.Value) != null)
            //    {
            //        if (c.Type.Equals(TipoOperazione.Richiesta))
            //            yield return new AuthorizationResult(Costanti.InterventoBloccato);
            //        if (c.Type.Equals(TipoOperazione.Mezzo))
            //            yield return new AuthorizationResult(Costanti.MezzoPrenotato);
            //        if (c.Type.Equals(TipoOperazione.Squadra))
            //            yield return new AuthorizationResult(Costanti.SquadraPrenotata);
            //    }
            //}

            if (_currentUser.Identity.IsAuthenticated)
            {
                if (command.utente == null)
                    yield return new AuthorizationResult(Costanti.UtenteNonAutorizzato);
                else
                {
                    bool abilitato = false;

                    if (_getAutorizzazioni.GetAutorizzazioniUtente(command.utente.Ruoli, command.CodComando, Costanti.GestoreRichieste))
                        abilitato = true;

                    if (_getAutorizzazioni.GetAutorizzazioniUtente(command.utente.Ruoli, command.CodComando, Costanti.GestoreChiamate))
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
