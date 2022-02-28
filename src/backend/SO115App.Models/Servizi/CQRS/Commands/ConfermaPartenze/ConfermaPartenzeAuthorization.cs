using CQRS.Authorization;
using CQRS.Commands.Authorizers;
using DomainModel.CQRS.Commands.ConfermaPartenze;
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

        public ConfermaPartenzeAuthorization(
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
                    //Controllo Concorrenza

                    var listaSediInteressate = _getSottoSediByCodSede.Get(new string[1] { command.Richiesta.CodSOCompetente });
                    var listaOperazioniBloccate = _getAllBlocks.GetAll(listaSediInteressate.ToArray());

                    var MezziBloccati = command.ConfermaPartenze.Partenze.FindAll(p => listaOperazioniBloccate.Any(b => b.Value.Equals(p.Mezzo.Codice))).ToList();
                    var SquadreBloccate = command.ConfermaPartenze.Partenze.FindAll(p => p.Squadre.Any(s => listaOperazioniBloccate.Any(l => l.Value.Equals(s.Codice)))).ToList();

                    if (MezziBloccati.Count > 0)
                    {
                        string mezziPrenotati = "";

                        if (MezziBloccati.Count > 1)
                        {
                            foreach (var mezzo in MezziBloccati)
                            {
                                mezziPrenotati = mezziPrenotati + "," + mezzo.Codice;
                            }

                            yield return new AuthorizationResult($"I mezzi {mezziPrenotati} risultano prenotati. Non è possibile confermare l'operazione.");
                        }
                        else
                            yield return new AuthorizationResult($"Il mezzo {MezziBloccati[0].Mezzo.Codice} risulta prenotato. Non è possibile confermare l'operazione.");
                    }

                    if (SquadreBloccate.Count > 0)
                    {
                        string SquadrePrenotate = "";

                        if (SquadreBloccate.Count > 1)
                        {
                            foreach (var squadra in SquadreBloccate)
                            {
                                SquadrePrenotate = SquadrePrenotate + "," + squadra.Codice;
                            }

                            yield return new AuthorizationResult($"Le squadre {SquadrePrenotate} risultano prenotate. Non è possibile confermare l'operazione.");
                        }
                        else
                            yield return new AuthorizationResult($"La squadra {SquadreBloccate[0].Codice} risulta prenotata. Non è possibile confermare l'operazione.");
                    }

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
