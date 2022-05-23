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
using Serilog;
using SO115App.API.Models.Classi.Condivise;
using SO115App.Models.Classi.Concorrenza;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.Autenticazione;
using SO115App.Models.Servizi.Infrastruttura.GestioneConcorrenza;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti.VerificaUtente;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Competenze;
using SO115App.Models.Servizi.Infrastruttura.Utility;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;

namespace DomainModel.CQRS.Commands.AddIntervento
{
    public class AddInterventoAuthorization : ICommandAuthorizer<AddInterventoCommand>
    {
        private readonly IPrincipal _currentUser;
        private readonly IFindUserByUsername _findUserByUsername;
        private readonly IGetAutorizzazioni _getAutorizzazioni;
        private readonly IGetSottoSediByCodSede _getSottoSediByCodSede;
        private readonly IIsActionFree _isActionFree;
        private readonly IGetCompetenzeByCoordinateIntervento _getCompetenze;

        public AddInterventoAuthorization(IPrincipal currentUser,
            IFindUserByUsername findUserByUsername,
            IGetAutorizzazioni getAutorizzazioni,
            IGetCompetenzeByCoordinateIntervento getCompetenze,
            IGetSottoSediByCodSede getSottoSediByCodSede,
            IIsActionFree isActionFree)
        {
            _currentUser = currentUser;
            _findUserByUsername = findUserByUsername;
            _getAutorizzazioni = getAutorizzazioni;
            _getSottoSediByCodSede = getSottoSediByCodSede;
            _isActionFree = isActionFree;
            _getCompetenze = getCompetenze;
        }

        public IEnumerable<AuthorizationResult> Authorize(AddInterventoCommand command)
        {
            Log.Information("Inserimento Intervento - Inizio Controlli di Autorizzazione");

            if (command.Chiamata.Competenze == null)
            {
                //command.CodCompetenze = _getCompetenze.GetCompetenzeByCoordinateIntervento(command.Chiamata.Localita.Coordinate).ToHashSet().ToArray();
                yield return new AuthorizationResult(Costanti.CompetenzeNonPresenti);
            }
            else
            {
                if (command.Chiamata.Competenze.Count > 0)
                    command.CodCompetenze = command.Chiamata.Competenze.Select(c => c.Codice).ToArray();
                //else if (command.Chiamata.CodCompetenze.Count > 0)
            }
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

                    if (command.Chiamata.CodiceSchedaNue != null)
                    {
                        var listaSediInteressate = _getSottoSediByCodSede.Get(new string[1] { command.CodiceSede });

                        if (!_isActionFree.Check(TipoOperazione.RegistrazioneSchedaContatto, user.Id, listaSediInteressate.ToArray(), command.Chiamata.CodiceSchedaNue))
                            yield return new AuthorizationResult(Costanti.InterventoOccupato);
                    }

                    #endregion Concorrenza

                    Boolean abilitato = false;
                    foreach (var ruolo in user.Ruoli)
                    {
                        if (_getAutorizzazioni.GetAutorizzazioniUtente(user.Ruoli, command.CodiceSede, Costanti.GestoreChiamate))
                            abilitato = true;
                        if (_getAutorizzazioni.GetAutorizzazioniUtente(user.Ruoli, command.CodiceSede, Costanti.GestoreRichieste))
                            abilitato = true;
                    }

                    if (!abilitato)
                        yield return new AuthorizationResult(Costanti.UtenteNonAutorizzato);
                }
            }
            else
                yield return new AuthorizationResult(Costanti.UtenteNonAutorizzato);

            Log.Information("Inserimento Intervento - Fine Controlli di Autorizzazione");
        }
    }
}
