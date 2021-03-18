//-----------------------------------------------------------------------
// <copyright file="ComposizioneSquadreAuthorizationQueryHandlerDecorator.cs" company="CNVVF">
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
using CQRS.Queries.Authorizers;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.Autenticazione;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti.VerificaUtente;
using System.Collections.Generic;
using System.Security.Principal;

namespace SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.ComposizionePartenzaAvanzata
{
    public class ComposizionePartenzaAvanzataAuthorizationQueryHandlerDecorator : IQueryAuthorizer<ComposizionePartenzaAvanzataQuery, ComposizionePartenzaAvanzataResult>
    {
        private readonly IPrincipal _currentUser;
        private readonly IFindUserByUsername _findUserByUsername;
        private readonly IGetAutorizzazioni _getAutorizzazioni;
        private readonly IGetRichiestaById _getRichiestaAssistenzaById;

        public ComposizionePartenzaAvanzataAuthorizationQueryHandlerDecorator(
            IPrincipal currentUser,
            IFindUserByUsername findUserByUsername,
            IGetAutorizzazioni getAutorizzazioni,
            IGetRichiestaById getRichiestaAssistenzaById)
        {
            _currentUser = currentUser;
            _findUserByUsername = findUserByUsername;
            _getAutorizzazioni = getAutorizzazioni;
            _getRichiestaAssistenzaById = getRichiestaAssistenzaById;
        }

        public IEnumerable<AuthorizationResult> Authorize(ComposizionePartenzaAvanzataQuery query)
        {
            var user = _findUserByUsername.FindUserByUs(_currentUser.Identity.Name);

            query.Richiesta = _getRichiestaAssistenzaById.GetById(query.Filtro.IdRichiesta);

            if (_currentUser.Identity.IsAuthenticated)
            {
                if (user == null)
                    yield return new AuthorizationResult(Costanti.UtenteNonAutorizzato);
                else
                {
                    bool abilitato = false;
                    foreach (var competenza in query.Richiesta.CodUOCompetenza)
                    {
                        if (_getAutorizzazioni.GetAutorizzazioniUtente(user.Ruoli, competenza, Costanti.GestoreRichieste))
                            abilitato = true;
                    }

                    if (query.Richiesta.CodSOAllertate != null)
                    {
                        foreach (var competenza in query.Richiesta.CodSOAllertate)
                        {
                            if (_getAutorizzazioni.GetAutorizzazioniUtente(user.Ruoli, competenza, Costanti.GestoreRichieste))
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
