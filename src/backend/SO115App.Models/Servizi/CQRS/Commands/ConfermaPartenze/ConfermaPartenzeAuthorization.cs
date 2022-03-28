using CQRS.Authorization;
using CQRS.Commands.Authorizers;
using DomainModel.CQRS.Commands.ConfermaPartenze;
using SO115App.Models.Classi.Concorrenza;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.Autenticazione;
using SO115App.Models.Servizi.Infrastruttura.GestioneConcorrenza;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti.VerificaUtente;
using SO115App.Models.Servizi.Infrastruttura.Utility;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Threading.Tasks;

namespace DomainModel.CQRS.Commands.MezzoPrenotato
{
    public class ConfermaPartenzeAuthorization : ICommandAuthorizer<ConfermaPartenzeCommand>
    {
        private readonly IPrincipal _currentUser;
        private readonly IFindUserByUsername _findUserByUsername;
        private readonly IGetAutorizzazioni _getAutorizzazioni;
        private readonly IGetRichiesta _getRichiestaById;
        private readonly IGetAllBlocks _getAllBlocks;
        private readonly IGetSottoSediByCodSede _getSottoSediByCodSede;
        private readonly IIsActionFree _isActionFree;

        public ConfermaPartenzeAuthorization(
            IPrincipal currentUser,
            IFindUserByUsername findUserByUsername,
            IGetAutorizzazioni getAutorizzazioni,
            IGetRichiesta getRichiestaById,
            IGetAllBlocks getAllBlocks,
            IGetSottoSediByCodSede getSottoSediByCodSede,
            IIsActionFree isActionFree)
        {
            _currentUser = currentUser;
            _findUserByUsername = findUserByUsername;
            _getAutorizzazioni = getAutorizzazioni;
            _getRichiestaById = getRichiestaById;
            _getAllBlocks = getAllBlocks;
            _getSottoSediByCodSede = getSottoSediByCodSede;
            _isActionFree = isActionFree;
        }

        public IEnumerable<AuthorizationResult> Authorize(ConfermaPartenzeCommand command)
        {
            command.Richiesta = _getRichiestaById.GetByCodice(command.ConfermaPartenze.IdRichiesta);
            command.Utente = _findUserByUsername.FindUserByUs(_currentUser.Identity.Name);

            if (_currentUser.Identity.IsAuthenticated)
            {
                if (command.Richiesta.TestoStatoRichiesta.Equals("X"))
                    yield return new AuthorizationResult(Costanti.ErroreRichiestaChiusa);

                if (command.Utente == null)
                    yield return new AuthorizationResult(Costanti.UtenteNonAutorizzato);
                else
                {
                    #region Concorrenza

                    //Controllo Concorrenza
                    var listaSediInteressate = _getSottoSediByCodSede.Get(new string[1] { command.Richiesta.CodSOCompetente });

                    var isFree = true;
                    Parallel.ForEach(command.ConfermaPartenze.Partenze, partenza =>
                    {
                        if (!_isActionFree.Check(TipoOperazione.InvioPartenza, command.Utente.Id, listaSediInteressate.ToArray(), partenza.Mezzo.Codice))
                            isFree = false;

                        Parallel.ForEach(partenza.Squadre, squadra =>
                        {
                            if (!_isActionFree.Check(TipoOperazione.InvioPartenza, command.Utente.Id, listaSediInteressate.ToArray(), squadra.Codice))
                                isFree = false;
                        });
                    });

                    if (!isFree)
                        yield return new AuthorizationResult($"La partenza risulta avere il mezzo o le squadre già utilizzati da un altro operatore.");

                    #endregion Concorrenza

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
