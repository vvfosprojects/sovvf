//-----------------------------------------------------------------------
// <copyright file="AddRuoliUtenteAuthorization.cs" company="CNVVF">
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
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti.GestioneRuolo;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti.VerificaUtente;
using SO115App.Models.Servizi.Infrastruttura.Utility;
using System.Collections.Generic;
using System.Security.Principal;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneUtenti.AddRuoliUtente
{
    public class AddRuoliUtenteAuthorization : ICommandAuthorizer<AddRuoliUtenteCommand>
    {
        private readonly IPrincipal _currentUser;
        private readonly IFindUserByUsername _findUserByUsername;
        private readonly IGetAutorizzazioni _getAutorizzazioni;
        private readonly ICheckEsistenzaRuolo _checkEsistenzaRuolo;
        private readonly IGetSottoSediByCodSede _getSottoSediByCodSede;
        private readonly IIsActionFree _isActionFree;

        public AddRuoliUtenteAuthorization(IPrincipal currentUser, IFindUserByUsername findUserByUsername,
            IGetAutorizzazioni getAutorizzazioni,
            ICheckEsistenzaRuolo checkEsistenzaRuolo,
            IGetSottoSediByCodSede getSottoSediByCodSede,
            IIsActionFree isActionFree)
        {
            _currentUser = currentUser;
            _findUserByUsername = findUserByUsername;
            _getAutorizzazioni = getAutorizzazioni;
            _checkEsistenzaRuolo = checkEsistenzaRuolo;
            _getSottoSediByCodSede = getSottoSediByCodSede;
            _isActionFree = isActionFree;
        }

        public IEnumerable<AuthorizationResult> Authorize(AddRuoliUtenteCommand command)
        {
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
                    var listaSediInteressate = _getSottoSediByCodSede.Get(new string[1] { command.CodiceSede });

                    if (!_isActionFree.Check(TipoOperazione.AggiungiRuoloUtente, user.Id, listaSediInteressate.ToArray(), command.CodFiscale))
                        yield return new AuthorizationResult($"In questo momento l'utente risulta occupato da un altro operatore. L'operazione non può essere eseguita");

                    #endregion Concorrenza

                    foreach (var ruolo in user.Ruoli)
                    {
                        foreach (var ruoloNew in command.Ruoli)
                        {
                            if (!_getAutorizzazioni.GetAutorizzazioniUtente(user.Ruoli, ruoloNew.CodSede, Costanti.Amministratore))
                                yield return new AuthorizationResult(Costanti.UtenteNonAutorizzato);
                        }
                    }

                    if (!_checkEsistenzaRuolo.Check(command.Ruoli, command.CodFiscale))
                        yield return new AuthorizationResult(Costanti.RuoloUtentePresente);
                }
            }
            else
                yield return new AuthorizationResult(Costanti.UtenteNonAutorizzato);
        }
    }
}
