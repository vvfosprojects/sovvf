//-----------------------------------------------------------------------
// <copyright file="DeleteUtenteAuthorization.cs" company="CNVVF">
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
using SO115App.API.Models.Classi.Autenticazione;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.Autenticazione;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti.GetUtenti;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti.VerificaUtente;
using System.Collections.Generic;
using System.Security.Principal;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneUtenti.CancellazioneUtente
{
    public class DeleteUtenteAuthorization : ICommandAuthorizer<DeleteUtenteCommand>
    {
        private readonly IPrincipal currentUser;
        private readonly IGetUtenteByCF _findUserByCF;
        private readonly IFindUserByUsername _findUserByUsername;
        private readonly IGetAutorizzazioni _getAutorizzazioni;

        public DeleteUtenteAuthorization(IPrincipal principal, IGetUtenteByCF findUserByCF,
                                        IFindUserByUsername findUserByUsername,
                                        IGetAutorizzazioni getAutorizzazioni)
        {
            currentUser = principal;
            _findUserByCF = findUserByCF;
            _findUserByUsername = findUserByUsername;
            _getAutorizzazioni = getAutorizzazioni;
        }

        public IEnumerable<AuthorizationResult> Authorize(DeleteUtenteCommand command)
        {
            var username = currentUser.Identity.Name;
            var userOperatore = _findUserByUsername.FindUserByUs(username);

            var CFuser = command.CodFiscale;
            var utenteDelete = _findUserByCF.Get(CFuser);

            if (currentUser.Identity.IsAuthenticated)
            {
                if (userOperatore == null)
                    yield return new AuthorizationResult(Costanti.UtenteNonAutorizzato);
                else
                {
                    foreach (var ruolo in userOperatore.Ruoli)
                    {
                        if (!_getAutorizzazioni.GetAutorizzazioniUtente(userOperatore.Ruoli, utenteDelete.Sede.Codice, Costanti.Amministratore))
                            yield return new AuthorizationResult(Costanti.UtenteNonAutorizzato);
                    }
                }
            }
            else
                yield return new AuthorizationResult(Costanti.UtenteNonAutorizzato);
        }
    }
}
