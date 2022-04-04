//-----------------------------------------------------------------------
// <copyright file="UpDateInterventoAuthorization.cs" company="CNVVF">
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
using System.Threading.Tasks;

namespace DomainModel.CQRS.Commands.UpDateStatoRichiesta
{
    public class UpDateStatoRichiestaAuthorization : ICommandAuthorizer<UpDateStatoRichiestaCommand>
    {
        private readonly IPrincipal _currentUser;
        private readonly IFindUserByUsername _findUserByUsername;
        private readonly IGetAutorizzazioni _getAutorizzazioni;
        private readonly IGetRichiesta _getRichiestaById;
        private readonly IGetAllBlocks _getAllBlocks;
        private readonly IGetSottoSediByCodSede _getSottoSediByCodSede;
        private readonly IIsActionFree _isActionFree;

        public UpDateStatoRichiestaAuthorization(IPrincipal currentUser, IFindUserByUsername findUserByUsername,
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

        public IEnumerable<AuthorizationResult> Authorize(UpDateStatoRichiestaCommand command)
        {
            command.Richiesta = _getRichiestaById.GetById(command.IdRichiesta);
            var username = this._currentUser.Identity.Name;
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

                    if (command.Stato.Equals(Costanti.RichiestaChiusa))
                    {
                        if (command.Richiesta.CodRichiesta != null)
                            if (!_isActionFree.Check(TipoOperazione.ChiusuraIntervento, user.Id, listaSediInteressate.ToArray(), command.Richiesta.Codice))
                                yield return new AuthorizationResult($"In questo momento l'intervento risulta occupato da un altro operatore. L'operazione non può essere eseguita");
                            else
                            if (!_isActionFree.Check(TipoOperazione.ChiusuraChiamata, user.Id, listaSediInteressate.ToArray(), command.Richiesta.Codice))
                                yield return new AuthorizationResult($"In questo momento la chiamata risulta occupata da un altro operatore. L'operazione non può essere eseguita");
                    }

                    #endregion Concorrenza

                    var listaOperazioniBloccate = _getAllBlocks.GetAll(listaSediInteressate.ToArray());

                    var findBlock = listaOperazioniBloccate.FindAll(o => o.Value.Equals(command.Richiesta.Codice));

                    if (findBlock != null && findBlock.Count > 0)
                        if (findBlock != null)
                        {
                            var verificaUtente = findBlock.FindAll(b => b.IdOperatore.Equals(command.IdOperatore));
                            if (verificaUtente.Count == 0)
                                yield return new AuthorizationResult(Costanti.InterventoBloccato);
                        }

                    if (!_getAutorizzazioni.GetAutorizzazioniUtente(user.Ruoli, command.CodiceSede, Costanti.GestoreRichieste))
                        yield return new AuthorizationResult(Costanti.UtenteNonAutorizzato);
                }
            }
            else
                yield return new AuthorizationResult(Costanti.UtenteNonAutorizzato);
        }
    }
}
