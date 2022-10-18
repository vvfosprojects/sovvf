using CQRS.Authorization;
using CQRS.Commands.Authorizers;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.Autenticazione;
using SO115App.Models.Servizi.Infrastruttura.GestioneConcorrenza;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti.VerificaUtente;
using SO115App.Models.Servizi.Infrastruttura.Utility;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.SostituzionePartenza
{
    public class SostituzionePartenzaAuthorization : ICommandAuthorizer<SostituzionePartenzaCommand>
    {
        private readonly IPrincipal _currentUser;
        private readonly IFindUserByUsername _findUserByUsername;
        private readonly IGetAutorizzazioni _getAutorizzazioni;
        private readonly IGetAllBlocks _getAllBlocks;
        private readonly IGetSottoSediByCodSede _getSottoSediByCodSede;

        public SostituzionePartenzaAuthorization(
            IPrincipal currentUser,
            IFindUserByUsername findUserByUsername,
            IGetAutorizzazioni getAutorizzazioni,
            IGetAllBlocks getAllBlocks,
            IGetSottoSediByCodSede getSottoSediByCodSede)
        {
            _currentUser = currentUser;
            _findUserByUsername = findUserByUsername;
            _getAutorizzazioni = getAutorizzazioni;
            _getAllBlocks = getAllBlocks;
            _getSottoSediByCodSede = getSottoSediByCodSede;
        }

        public IEnumerable<AuthorizationResult> Authorize(SostituzionePartenzaCommand command)
        {
            var username = _currentUser.Identity.Name;
            var user = _findUserByUsername.FindUserByUs(username);

            if (_currentUser.Identity.IsAuthenticated)
            {
                if (user == null)
                    yield return new AuthorizationResult(Costanti.UtenteNonAutorizzato);
                else
                {
                    var listaSediInteressate = _getSottoSediByCodSede.Get(new string[1] { command.Richiesta.CodSOCompetente.Split('.')[0] + ".1000" });
                    var listaOperazioniBloccate = _getAllBlocks.GetAll(listaSediInteressate.ToArray());

                    var findBlock = listaOperazioniBloccate.FindAll(o => o.Value.Equals(command.Richiesta.Id));

                    if (findBlock != null && findBlock.Count > 0)
                    {
                        var verificaUtente = findBlock.FindAll(b => b.IdOperatore.Equals(command.sostituzione.idOperatore));
                        if (verificaUtente.Count == 0)
                            yield return new AuthorizationResult(Costanti.InterventoBloccato);
                    }

                    if (command.Richiesta.Chiusa)
                        yield return new AuthorizationResult(Costanti.MezzoErroreCambioStatoRichiestaChiusa);

                    bool abilitato = false;

                    if (_getAutorizzazioni.GetAutorizzazioniUtente(user.Ruoli, command.Richiesta.CodSOCompetente, Costanti.GestoreRichieste))
                        abilitato = true;

                    if (command.Richiesta.CodSOAllertate != null)
                    {
                        foreach (var competenza in command.Richiesta.CodSOAllertate)
                        {
                            if (_getAutorizzazioni.GetAutorizzazioniUtente(user.Ruoli, competenza, Costanti.GestoreRichieste))
                                abilitato = true;
                        }
                    }

                    foreach (var sostituzione in command.sostituzione.Sostituzioni)
                    {
                        var composizione = command.Richiesta.Partenze.Where(m => m.CodiceMezzo.Equals(sostituzione.CodMezzo)).FirstOrDefault();
                        var codiceSedeMezzo = composizione.Partenza.Mezzo.Distaccamento.Codice;

                        if (!_getAutorizzazioni.GetAutorizzazioniUtente(user.Ruoli, codiceSedeMezzo, Costanti.GestoreRichieste))
                            abilitato = false;
                    }

                    //if (command.Richiesta.CodUOCompetenza!=null)
                    //    foreach (var competenza in command.Richiesta.CodUOCompetenza)
                    //    {
                    //        if (_getAutorizzazioni.GetAutorizzazioniUtente(user.Ruoli, competenza, Costanti.GestoreRichieste))
                    //            abilitato = true;
                    //    }



                    if (!abilitato)
                        yield return new AuthorizationResult(Costanti.UtenteNonAutorizzato);
                }
            }
            else
                yield return new AuthorizationResult(Costanti.UtenteNonAutorizzato);
        }
    }
}
