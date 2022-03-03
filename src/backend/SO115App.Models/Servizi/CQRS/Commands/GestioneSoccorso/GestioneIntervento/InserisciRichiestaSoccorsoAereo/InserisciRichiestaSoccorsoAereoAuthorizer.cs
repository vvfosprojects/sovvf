using CQRS.Authorization;
using CQRS.Commands.Authorizers;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.Autenticazione;
using SO115App.Models.Servizi.Infrastruttura.GestioneConcorrenza;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti.VerificaUtente;
using SO115App.Models.Servizi.Infrastruttura.Utility;
using System.Collections.Generic;
using System.Security.Principal;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneIntervento.InserisciRichiestaSoccorsoAereo
{
    public class InserisciRichiestaSoccorsoAereoAuthorizer : ICommandAuthorizer<InserisciRichiestaSoccorsoAereoCommand>
    {
        private readonly IPrincipal _currentUser;
        private readonly IFindUserByUsername _findUserByUsername;
        private readonly IGetAutorizzazioni _getAutorizzazioni;
        private readonly IGetRichiesta _getRichiestaById;
        private readonly IGetAllBlocks _getAllBlocks;
        private readonly IGetSottoSediByCodSede _getSottoSediByCodSede;

        public InserisciRichiestaSoccorsoAereoAuthorizer(
            IPrincipal currentUser,
            IFindUserByUsername findUserByUsername,
            IGetAutorizzazioni getAutorizzazioni,
            IGetRichiesta getRichiestaById,
            IGetAllBlocks getAllBlocks,
            IGetSottoSediByCodSede getSottoSediByCodSede)
        {
            _currentUser = currentUser;
            _findUserByUsername = findUserByUsername;
            _getAutorizzazioni = getAutorizzazioni;
            _getRichiestaById = getRichiestaById;
            _getAllBlocks = getAllBlocks;
            _getSottoSediByCodSede = getSottoSediByCodSede;
        }

        public IEnumerable<AuthorizationResult> Authorize(InserisciRichiestaSoccorsoAereoCommand command)
        {
            command.Richiesta = _getRichiestaById.GetByCodice(command.RichiestaSoccorsoAereo.requestKey);

            command.Utente = _findUserByUsername.FindUserByUs(_currentUser.Identity.Name);

            if (_currentUser.Identity.IsAuthenticated)
            {
                if (command.Utente == null)
                    yield return new AuthorizationResult(Costanti.UtenteNonAutorizzato);
                else
                {
                    var listaSediInteressate = _getSottoSediByCodSede.Get(new string[1] { command.Richiesta.CodSOCompetente.Split('.')[0] + ".1000" });
                    var listaOperazioniBloccate = _getAllBlocks.GetAll(listaSediInteressate.ToArray());

                    var findBlock = listaOperazioniBloccate.FindAll(o => o.Value.Equals(command.Richiesta.Id));

                    if (findBlock != null)
                    {
                        var verificaUtente = findBlock.FindAll(b => b.IdOperatore.Equals(command.Utente.Id));
                        if (verificaUtente.Count == 0)
                            yield return new AuthorizationResult(Costanti.InterventoBloccato);
                    }

                    bool abilitato = false;

                    if (command.Richiesta.CodUOCompetenza != null)
                    {
                        foreach (var competenza in command.Richiesta.CodUOCompetenza)
                        {
                            if (_getAutorizzazioni.GetAutorizzazioniUtente(command.Utente.Ruoli, competenza, Costanti.GestoreRichieste))
                                abilitato = true;
                        }
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
