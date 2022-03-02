using CQRS.Authorization;
using CQRS.Commands.Authorizers;
using SO115App.API.Models.Servizi.CQRS.Mappers.RichiestaSuSintesi;
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

        public AddTrasferimentoAuthorization(IPrincipal currentUser, IFindUserByUsername findUserByUsername, IGetAutorizzazioni getAutorizzazioni,
            IGetAllBlocks getAllBlocks, IGetSottoSediByCodSede getSottoSediByCodSede, IMapperRichiestaSuSintesi map,
            IGetCompetenzeByCoordinateIntervento getCompetenze, IGetRichiesta getRichiestaById)
        {
            _currentUser = currentUser;
            _findUserByUsername = findUserByUsername;
            _getAutorizzazioni = getAutorizzazioni;
            _getAllBlocks = getAllBlocks;
            _getSottoSediByCodSede = getSottoSediByCodSede;
            _map = map;
            _getCompetenze = getCompetenze;
            _getRichiestaById = getRichiestaById;
        }

        public IEnumerable<AuthorizationResult> Authorize(AddTrasferimentoCommand command)
        {
            var username = _currentUser.Identity.Name;
            var user = _findUserByUsername.FindUserByUs(username);
            var richiesta = _getRichiestaById.GetByCodice(command.TrasferimentoChiamata.CodChiamata);
            var Competenze = _getCompetenze.GetCompetenzeByCoordinateIntervento(richiesta.Localita.Coordinate);

            if (_currentUser.Identity.IsAuthenticated)
            {
                if (user == null)
                    yield return new AuthorizationResult(Costanti.UtenteNonAutorizzato);
                else
                {
                    var listaSediInteressate = _getSottoSediByCodSede.Get(new string[1] { Competenze.ToArray()[0].Split('.')[0] + ".1000" });
                    var listaOperazioniBloccate = _getAllBlocks.GetAll(listaSediInteressate.ToArray());

                    var findBlock = listaOperazioniBloccate.FindAll(o => o.Value.Equals(richiesta.Id));

                    if (findBlock != null && findBlock.Count != 0)
                    {
                        var verificaUtente = findBlock.FindAll(b => b.IdOperatore.Equals(command.IdOperatore));
                        if (verificaUtente.Count == 0)
                            yield return new AuthorizationResult(Costanti.InterventoBloccato);
                    }

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
