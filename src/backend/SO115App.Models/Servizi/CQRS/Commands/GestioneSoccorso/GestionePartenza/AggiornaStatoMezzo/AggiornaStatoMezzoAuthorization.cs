﻿//-----------------------------------------------------------------------
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
using SO115App.Models.Classi.Concorrenza;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.Autenticazione;
using SO115App.Models.Servizi.Infrastruttura.GestioneConcorrenza;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti.VerificaUtente;
using SO115App.Models.Servizi.Infrastruttura.Utility;
using System.Collections.Generic;
using System.Security.Principal;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.AggiornaStatoMezzo
{
    public class AggiornaStatoMezzoAuthorization : ICommandAuthorizer<AggiornaStatoMezzoCommand>
    {
        private readonly IPrincipal _currentUser;
        private readonly IFindUserByUsername _findUserByUsername;
        private readonly IGetAutorizzazioni _getAutorizzazioni;
        private readonly IGetRichiesta _getRichiestaById;
        private readonly IGetAllBlocks _getAllBlocks;
        private readonly IGetSottoSediByCodSede _getSottoSediByCodSede;
        private readonly IIsActionFree _isActionFree;

        public AggiornaStatoMezzoAuthorization(IPrincipal currentUser, IFindUserByUsername findUserByUsername,
            IGetAutorizzazioni getAutorizzazioni,
            IGetRichiesta getRichiestaById,
            IGetAllBlocks getAllBlocks,
            IGetSottoSediByCodSede getSottoSediByCodSede,
            IIsActionFree isActionFree)
        {
            _currentUser = currentUser;
            _findUserByUsername = findUserByUsername;
            _getAutorizzazioni = getAutorizzazioni;
            _getRichiestaById = getRichiestaById;
            _getAllBlocks = getAllBlocks;
            _getSottoSediByCodSede = getSottoSediByCodSede;
            _isActionFree = isActionFree;
        }

        public IEnumerable<AuthorizationResult> Authorize(AggiornaStatoMezzoCommand command)
        {
            command.Richiesta = _getRichiestaById.GetByCodice(command.CodRichiesta);
            var richiesta = command.Richiesta;

            var username = _currentUser.Identity.Name;
            var user = _findUserByUsername.FindUserByUs(username);

            if (_currentUser.Identity.IsAuthenticated)
            {
                if (user == null)
                    yield return new AuthorizationResult(Costanti.UtenteNonAutorizzato);
                else
                {
                    #region Concorrenza

                    //Controllo Concorrenza
                    var listaSediInteressate = _getSottoSediByCodSede.Get(new string[1] { command.Richiesta.CodSOCompetente });

                    if (command.Richiesta.CodRichiesta != null)
                        if (!_isActionFree.Check(TipoOperazione.CambioStatoPartenza, user.Id, listaSediInteressate.ToArray(), command.Richiesta.Codice))
                            yield return new AuthorizationResult(Costanti.InterventoOccupato);

                    #endregion Concorrenza

                    bool abilitato = false;

                    if (_getAutorizzazioni.GetAutorizzazioniUtente(user.Ruoli, richiesta.CodSOCompetente, Costanti.GestoreRichieste))
                        abilitato = true;

                    if (richiesta.CodUOCompetenza!=null)
                        foreach (var competenza in richiesta.CodUOCompetenza)
                        {
                            if (_getAutorizzazioni.GetAutorizzazioniUtente(user.Ruoli, competenza, Costanti.GestoreRichieste))
                                abilitato = true;
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
