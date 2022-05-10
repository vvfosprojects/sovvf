﻿//-----------------------------------------------------------------------
// <copyright file="SetSchedaGestitaAuthorization.cs" company="CNVVF">
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
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.Autenticazione;
using SO115App.Models.Servizi.Infrastruttura.GestioneConcorrenza;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti.VerificaUtente;
using SO115App.Models.Servizi.Infrastruttura.Utility;
using System.Collections.Generic;
using System.Security.Principal;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSchedeNue.MergeSchedeNue
{
    internal class MergeSchedeNueAuthorization
    {
        private readonly IPrincipal _currentUser;
        private readonly IGetAutorizzazioni _getAutorizzazioni;
        private readonly IGetUtenteById _getUtenteById;
        private readonly IIsActionFree _isActionFree;
        private readonly IGetSottoSediByCodSede _getSottoSediByCodSede;

        public MergeSchedeNueAuthorization(IPrincipal currentUser, 
            IGetAutorizzazioni getAutorizzazioni,
            IGetUtenteById getUtenteById,
            IIsActionFree isActionFree,
            IGetSottoSediByCodSede getSottoSediByCodSede)
        {
            _currentUser = currentUser;
            _getAutorizzazioni = getAutorizzazioni;
            _getUtenteById = getUtenteById;
            _isActionFree = isActionFree;
            _getSottoSediByCodSede = getSottoSediByCodSede;
        }

        public IEnumerable<AuthorizationResult> Authorize(MergeSchedeNueCommand command)
        {
            var user = _getUtenteById.GetUtenteByCodice(command.IdUtente);

            if (_currentUser.Identity.IsAuthenticated)
            {
                if (user == null)
                    yield return new AuthorizationResult(Costanti.UtenteNonAutorizzato);
                else
                {
                    #region CONCORRENZA

                    var listaSediInteressate = _getSottoSediByCodSede.Get(new string[1] { command.CodiceSede });
                    //TODO AGGIORNARE NUOVO ID SCHEDA NUE (NUOVO ID COMPOSTO)
                    if (!_isActionFree.Check(Classi.Concorrenza.TipoOperazione.RaggrauppamentoSchedeContatto, command.IdUtente, listaSediInteressate.ToArray(), command.SchedaNue.CodiceSede))
                        yield return new AuthorizationResult("Scheda in utilizzo da un altro operatore.");

                    #endregion

                    foreach (var ruolo in user.Ruoli)
                    {
                        if (!_getAutorizzazioni.GetAutorizzazioniUtente(user.Ruoli, command.SchedaNue.CodiceSede, Costanti.GestoreChiamate))
                            yield return new AuthorizationResult(Costanti.UtenteNonAutorizzato);
                    }
                }
            }
            else
                yield return new AuthorizationResult(Costanti.UtenteNonAutorizzato);
        }
    }
}
