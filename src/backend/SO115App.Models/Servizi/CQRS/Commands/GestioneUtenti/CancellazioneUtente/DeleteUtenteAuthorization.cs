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
using SO115App.Models.Classi.Concorrenza;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.Autenticazione;
using SO115App.Models.Servizi.Infrastruttura.GestioneConcorrenza;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti.GetUtenti;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti.VerificaUtente;
using SO115App.Models.Servizi.Infrastruttura.Utility;
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
        private readonly IGetSottoSediByCodSede _getSottoSediByCodSede;
        private readonly IIsActionFree _isActionFree;

        public DeleteUtenteAuthorization(IPrincipal principal, IGetUtenteByCF findUserByCF,
                                        IFindUserByUsername findUserByUsername,
                                        IGetAutorizzazioni getAutorizzazioni,
                                        IGetSottoSediByCodSede getSottoSediByCodSede,
                                        IIsActionFree isActionFree)
        {
            currentUser = principal;
            _findUserByCF = findUserByCF;
            _findUserByUsername = findUserByUsername;
            _getAutorizzazioni = getAutorizzazioni;
            _getSottoSediByCodSede = getSottoSediByCodSede;
            _isActionFree = isActionFree;
        }

        public IEnumerable<AuthorizationResult> Authorize(DeleteUtenteCommand command)
        {
            var username = currentUser.Identity.Name;
            var userOperatore = _findUserByUsername.FindUserByUs(username);
            command.UtenteOperatore = userOperatore;
            var CFuser = command.CodFiscale;
            var utenteDelete = _findUserByCF.Get(CFuser);
            command.UtenteRimosso = utenteDelete;

            if (currentUser.Identity.IsAuthenticated)
            {
                if (userOperatore == null)
                    yield return new AuthorizationResult(Costanti.UtenteNonAutorizzato);
                else
                {
                    #region Concorrenza

                    //Controllo Concorrenza
                    var listaSediInteressate = _getSottoSediByCodSede.Get(new string[1] { command.CodiceSede });

                    if (!_isActionFree.Check(TipoOperazione.AggiungiRuoloUtente, userOperatore.Id, listaSediInteressate.ToArray(), command.CodFiscale))
                        yield return new AuthorizationResult(Costanti.UtenteOccupato);

                    #endregion Concorrenza


                    bool valido = false;
                    foreach (var ruolo in userOperatore.Ruoli)
                    {
                        if (!_getAutorizzazioni.GetAutorizzazioniUtente(userOperatore.Ruoli, utenteDelete.Sede.Codice, Costanti.Amministratore))
                        {
                            valido = true;
                            command.CheckSedeAdmin = false;
                        }
                    }

                    foreach(var ruoloUserDelete in utenteDelete.Ruoli)
                    {
                        if (!_getAutorizzazioni.GetAutorizzazioniUtente(userOperatore.Ruoli, ruoloUserDelete.CodSede, Costanti.Amministratore))
                            valido = true;
                    }

                    if(!valido)
                        yield return new AuthorizationResult(Costanti.UtenteNonAutorizzato);

                }
            }
            else
                yield return new AuthorizationResult(Costanti.UtenteNonAutorizzato);
        }
    }
}
