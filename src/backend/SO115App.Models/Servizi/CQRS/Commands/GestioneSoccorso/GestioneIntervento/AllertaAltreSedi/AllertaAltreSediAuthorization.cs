﻿//-----------------------------------------------------------------------
// <copyright file="AllertaAltreSediAuthorization.cs" company="CNVVF">
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
using SO115App.API.Models.Servizi.CQRS.Mappers.RichiestaSuSintesi;
using SO115App.Models.Classi.Concorrenza;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.Autenticazione;
using SO115App.Models.Servizi.Infrastruttura.GestioneConcorrenza;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti.VerificaUtente;
using SO115App.Models.Servizi.Infrastruttura.Utility;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;

namespace DomainModel.CQRS.Commands.AllertaAltreSedi
{
    public class AllertaAltreSediAuthorization : ICommandAuthorizer<AllertaAltreSediCommand>
    {
        private readonly IPrincipal _currentUser;
        private readonly IFindUserByUsername _findUserByUsername;
        private readonly IGetAutorizzazioni _getAutorizzazioni;
        private readonly IGetRichiesta _getRichiestaById;
        private readonly IGetAllBlocks _getAllBlocks;
        private readonly IGetSottoSediByCodSede _getSottoSediByCodSede;
        private readonly IIsActionFree _isActionFree;
        private readonly IMapperRichiestaSuSintesi _map;

        public AllertaAltreSediAuthorization(IPrincipal currentUser, IFindUserByUsername findUserByUsername,
            IGetAutorizzazioni getAutorizzazioni, IMapperRichiestaSuSintesi map,
            IGetRichiesta getRichiestaById, IGetAllBlocks getAllBlocks, IGetSottoSediByCodSede getSottoSediByCodSede,
            IIsActionFree isActionFree)
        {
            _currentUser = currentUser;
            _findUserByUsername = findUserByUsername;
            _getAutorizzazioni = getAutorizzazioni;
            _getRichiestaById = getRichiestaById;
            _getAllBlocks = getAllBlocks;
            _getSottoSediByCodSede = getSottoSediByCodSede;
            _isActionFree = isActionFree;
            _map = map;
        }

        public IEnumerable<AuthorizationResult> Authorize(AllertaAltreSediCommand command)
        {
            var richiesta = _getRichiestaById.GetByCodice(command.CodiceRichiesta);
            //var Competenze = richiesta.Competenze.Select(c => c.Codice).ToArray();
            command.Chiamata = _map.Map(richiesta);

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
                    var listaSediInteressate = _getSottoSediByCodSede.Get(new string[1] { command.CodiceSede });

                    if (!_isActionFree.Check(TipoOperazione.Allerta, user.Id, listaSediInteressate.ToArray(), command.Chiamata.Codice))
                        yield return new AuthorizationResult(Costanti.InterventoOccupato);

                    #endregion Concorrenza

                    Boolean abilitato = false;

                    if (_getAutorizzazioni.GetAutorizzazioniUtente(user.Ruoli, command.CodiceSede, Costanti.GestoreChiamate))
                        abilitato = true;
                    if (_getAutorizzazioni.GetAutorizzazioniUtente(user.Ruoli, command.CodiceSede, Costanti.GestoreRichieste))
                        abilitato = true;
                                       

                    if (!abilitato)
                        yield return new AuthorizationResult(Costanti.UtenteNonAutorizzato);
                }
            }
            else
                yield return new AuthorizationResult(Costanti.UtenteNonAutorizzato);
        }
    }
}
