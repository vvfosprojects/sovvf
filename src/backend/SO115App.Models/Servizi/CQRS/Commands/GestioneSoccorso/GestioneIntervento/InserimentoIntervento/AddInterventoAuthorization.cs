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
using System.Collections.Generic;
using System.Security.Principal;
using CQRS.Authorization;
using CQRS.Commands.Authorizers;
using SO115App.API.Models.Classi.Autenticazione;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.Autenticazione;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti.VerificaUtente;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Competenze;

namespace DomainModel.CQRS.Commands.AddIntervento
{
    public class AddInterventoAuthorization : ICommandAuthorizer<AddInterventoCommand>
    {
        private readonly IPrincipal _currentUser;
        private readonly IFindUserByUsername _findUserByUsername;
        private readonly IGetAutorizzazioni _getAutorizzazioni;
        private readonly IGetCompetenzeByCoordinateIntervento _getCompetenze;

        public AddInterventoAuthorization(IPrincipal currentUser,
            IFindUserByUsername findUserByUsername,
            IGetAutorizzazioni getAutorizzazioni,
            IGetCompetenzeByCoordinateIntervento getCompetenze)
        {
            _currentUser = currentUser;
            _findUserByUsername = findUserByUsername;
            _getAutorizzazioni = getAutorizzazioni;
            _getCompetenze = getCompetenze;
        }

        public IEnumerable<AuthorizationResult> Authorize(AddInterventoCommand command)
        {
            var Competenza = _getCompetenze.GetCompetenzeByCoordinateIntervento(command.Chiamata.Localita.Coordinate);
            string[] CodUOCompetenzaAppo = {
                Competenza.CodProvincia + "." + Competenza.CodDistaccamento,
                Competenza.CodProvincia + "." + Competenza.CodDistaccamento2,
                Competenza.CodProvincia + "." + Competenza.CodDistaccamento3,
                Competenza.CodProvincia + ".1000"
            };
            var username = _currentUser.Identity.Name;
            var user = _findUserByUsername.FindUserByUs(username);

            if (_currentUser.Identity.IsAuthenticated)
            {
                if (user == null)
                    yield return new AuthorizationResult(Costanti.UtenteNonAutorizzato);
                else
                {
                    foreach (var ruolo in user.Ruoli)
                    {
                        foreach (var competenza in CodUOCompetenzaAppo)
                        {
                            if (!_getAutorizzazioni.GetAutorizzazioniUtente(user.Ruoli, competenza, Costanti.GestoreChiamate))
                                yield return new AuthorizationResult(Costanti.UtenteNonAutorizzato);
                        }
                    }
                }
            }
            else
                yield return new AuthorizationResult(Costanti.UtenteNonAutorizzato);
        }
    }
}
