using CQRS.Authorization;
using CQRS.Commands.Authorizers;
using SO115App.API.Models.Servizi.CQRS.Mappers.RichiestaSuSintesi;
using SO115App.Models.Classi.Concorrenza;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.Autenticazione;
using SO115App.Models.Servizi.Infrastruttura.GestioneConcorrenza;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti.VerificaUtente;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Competenze;
using SO115App.Models.Servizi.Infrastruttura.Utility;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneTrasferimentiChiamate.AddTrasferimento
{
    public class AddTrasferimentoAuthorization : ICommandAuthorizer<AddTrasferimentoCommand>
    {
        private readonly IPrincipal _currentUser;
        private readonly IFindUserByUsername _findUserByUsername;
        private readonly IGetAutorizzazioni _getAutorizzazioni;
        private readonly IGetAllBlocks _getAllBlocks;
        private readonly IGetSottoSediByCodSede _getSottoSediByCodSede;
        private readonly IMapperRichiestaSuSintesi _map;
        private readonly IGetCompetenzeByCoordinateIntervento _getCompetenze;
        private readonly IGetRichiesta _getRichiestaById;
        private readonly IIsActionFree _isActionFree;

        public AddTrasferimentoAuthorization(IPrincipal currentUser, IFindUserByUsername findUserByUsername, IGetAutorizzazioni getAutorizzazioni,
            IGetAllBlocks getAllBlocks, IGetSottoSediByCodSede getSottoSediByCodSede, IMapperRichiestaSuSintesi map,
            IGetCompetenzeByCoordinateIntervento getCompetenze, IGetRichiesta getRichiestaById,
            IIsActionFree isActionFree)
        {
            _currentUser = currentUser;
            _findUserByUsername = findUserByUsername;
            _getAutorizzazioni = getAutorizzazioni;
            _getAllBlocks = getAllBlocks;
            _getSottoSediByCodSede = getSottoSediByCodSede;
            _map = map;
            _getCompetenze = getCompetenze;
            _getRichiestaById = getRichiestaById;
            _isActionFree = isActionFree;
        }

        public IEnumerable<AuthorizationResult> Authorize(AddTrasferimentoCommand command)
        {
            var username = _currentUser.Identity.Name;
            var user = _findUserByUsername.FindUserByUs(username);
            command.Richiesta = _getRichiestaById.GetByCodice(command.TrasferimentoChiamata.CodChiamata);
            //var Competenze = _getCompetenze.GetCompetenzeByCoordinateIntervento(richiesta.Localita.Coordinate);

            if (_currentUser.Identity.IsAuthenticated)
            {
                if (user == null)
                    yield return new AuthorizationResult(Costanti.UtenteNonAutorizzato);
                else
                {
                    #region Concorrenza

                    //Controllo Concorrenza
                    var listaSediInteressate = _getSottoSediByCodSede.Get(new string[1] { command.Richiesta.CodSOCompetente });

                    if (command.Richiesta.CodRichiesta == null)
                        if (!_isActionFree.Check(TipoOperazione.Trasferimento, user.Id, listaSediInteressate.ToArray(), command.Richiesta.Codice))
                            yield return new AuthorizationResult($"In questo momento la chiamata risulta occupata da un altro operatore. L'operazione non può essere eseguita");

                    #endregion Concorrenza

                    bool abilitato = false;
                    foreach (var ruolo in user.Ruoli)
                    {
                        if (_getAutorizzazioni.GetAutorizzazioniUtente(user.Ruoli, command.CodiciSede[0], Costanti.GestoreChiamate))
                            abilitato = true;
                        if (_getAutorizzazioni.GetAutorizzazioniUtente(user.Ruoli, command.CodiciSede[0], Costanti.GestoreRichieste))
                            abilitato = true;
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
