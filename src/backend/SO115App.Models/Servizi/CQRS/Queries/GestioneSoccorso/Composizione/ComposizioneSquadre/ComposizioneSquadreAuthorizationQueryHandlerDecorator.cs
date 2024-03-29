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
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.ComposizioneSquadre;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.Autenticazione;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti.VerificaUtente;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;

namespace SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.ComposizioneMezzi
{
    public class ComposizioneSquadreAuthorizationQueryHandlerDecorator : IQueryAuthorizer<ComposizioneSquadreQuery, ComposizioneSquadreResult>
    {
        private readonly IPrincipal _currentUser;
        private readonly IFindUserByUsername _findUserByUsername;
        private readonly IGetAutorizzazioni _getAutorizzazioni;
        private readonly IGetRichiesta _getRichiestaAssistenzaById;

        public ComposizioneSquadreAuthorizationQueryHandlerDecorator(IPrincipal currentUser, IFindUserByUsername findUserByUsername,
            IGetAutorizzazioni getAutorizzazioni, IGetRichiesta getRichiestaAssistenzaById)
        {
            this._currentUser = currentUser;
            _findUserByUsername = findUserByUsername;
            this._getAutorizzazioni = getAutorizzazioni;
            _getRichiestaAssistenzaById = getRichiestaAssistenzaById;
        }

        public IEnumerable<AuthorizationResult> Authorize(ComposizioneSquadreQuery query)
        {
            var username = this._currentUser.Identity.Name;
            var user = _findUserByUsername.FindUserByUs(username);
            var richiesta = _getRichiestaAssistenzaById.GetByCodice(query.Filtro.CodiceChiamata);
            query.Filtro.CodiciCompetenze = query.Filtro.CodiciDistaccamenti;// richiesta.Competenze.Select(c => c.Codice).ToArray();

            if (this._currentUser.Identity.IsAuthenticated)
            {
                if (user == null)
                    yield return new AuthorizationResult(Costanti.UtenteNonAutorizzato);
                else
                {
                    bool abilitato = false;

                    if (_getAutorizzazioni.GetAutorizzazioniUtente(user.Ruoli, richiesta.CodSOCompetente, Costanti.GestoreRichieste))
                        abilitato = true;

                    if (richiesta.CodUOCompetenza != null)
                    {
                        foreach (var competenza in richiesta.CodUOCompetenza)
                        {
                            if (_getAutorizzazioni.GetAutorizzazioniUtente(user.Ruoli, competenza, Costanti.GestoreRichieste))
                                abilitato = true;
                        }
                    }

                    if (richiesta.CodSOAllertate != null)
                    {
                        foreach (var competenza in richiesta.CodSOAllertate)
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
