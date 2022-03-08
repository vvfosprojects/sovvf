//-----------------------------------------------------------------------
// <copyright file="AddInterventoAuthorization.cs" company="CNVVF">
// Copyright (C) 2017 - CNVVF
//
// This file is part of SOVVF.
// SOVVF is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// SOVVF is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see http://www.gnu.org/licenses/.
// </copyright>
//-----------------------------------------------------------------------
using CQRS.Authorization;
using CQRS.Commands.Authorizers;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.Autenticazione;
using SO115App.Models.Servizi.Infrastruttura.GestioneConcorrenza;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti.VerificaUtente;
using SO115App.Models.Servizi.Infrastruttura.Utility;
using System.Collections.Generic;
using System.Security.Principal;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneIntervento.GestioneEntiIntervenuti
{
    public class EntiIntervenutiAuthorization : ICommandAuthorizer<EntiIntervenutiCommand>
    {
        private readonly IPrincipal _currentUser;
        private readonly IFindUserByUsername _findUserByUsername;
        private readonly IGetAutorizzazioni _getAutorizzazioni;
        private readonly IGetRichiesta _getRichiestaById;
        private readonly IGetSintesiRichiestaAssistenzaByCodice _getSintesiRichiestaAssistenzaByCodice;
        private readonly IGetAllBlocks _getAllBlocks;
        private readonly IGetSottoSediByCodSede _getSottoSediByCodSede;

        public EntiIntervenutiAuthorization(IPrincipal currentUser,
            IFindUserByUsername findUserByUsername, IGetAutorizzazioni getAutorizzazioni, IGetRichiesta getRichiestaById,
            IGetSintesiRichiestaAssistenzaByCodice getSintesiRichiestaAssistenzaByCodice,
            IGetAllBlocks getAllBlocks,
            IGetSottoSediByCodSede getSottoSediByCodSede)
        {
            _currentUser = currentUser;
            _findUserByUsername = findUserByUsername;
            _getAutorizzazioni = getAutorizzazioni;
            _getRichiestaById = getRichiestaById;
            _getSintesiRichiestaAssistenzaByCodice = getSintesiRichiestaAssistenzaByCodice;
            _getAllBlocks = getAllBlocks;
            _getSottoSediByCodSede = getSottoSediByCodSede;
        }

        public IEnumerable<AuthorizationResult> Authorize(EntiIntervenutiCommand command)
        {
            var username = _currentUser.Identity.Name;
            var user = _findUserByUsername.FindUserByUs(username);

            command.Richiesta = _getRichiestaById.GetById(command.CodRichiesta);

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
                        var verificaUtente = findBlock.FindAll(b => b.IdOperatore.Equals(user.Id));
                        if (verificaUtente.Count == 0)
                            yield return new AuthorizationResult(Costanti.InterventoBloccato);
                    }

                    bool abilitato = false;

                    if (_getAutorizzazioni.GetAutorizzazioniUtente(user.Ruoli, command.Richiesta.CodSOCompetente, Costanti.GestoreRichieste))
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
