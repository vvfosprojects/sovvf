//-----------------------------------------------------------------------
// <copyright file="ChiamataInCorsoMarkerAuthorization.cs" company="CNVVF">
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
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using CQRS.Authorization;
using CQRS.Commands.Authorizers;
using SO115App.API.Models.Classi.Autenticazione;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.RicercaRichiesteAssistenza;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.Utility;
using SO115App.Models.Servizi.Infrastruttura.Autenticazione;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti.VerificaUtente;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneChiamateInCorso;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Competenze;

namespace DomainModel.CQRS.Commands.ChiamataInCorsoMarker
{
    public class ChiamataInCorsoMarkerAuthorization : ICommandAuthorizer<ChiamataInCorsoMarkerCommand>
    {
        private readonly IPrincipal _currentUser;
        private readonly IFindUserByUsername _findUserByUsername;
        private readonly IGetAutorizzazioni _getAutorizzazioni;
        private readonly IGetCompetenzeByCoordinateIntervento _getCompetenze;
        private readonly IGetListaSintesi _getListaSintesi;
        private readonly GetPinNodoByCodSede _getPinNodoByCodSede;
        private readonly INotificationDoubleChiamataInCorso _notificationDoubleChiamataInCorso;

        public ChiamataInCorsoMarkerAuthorization(IPrincipal currentUser, IFindUserByUsername findUserByUsername,
            IGetAutorizzazioni getAutorizzazioni,
            IGetCompetenzeByCoordinateIntervento getCompetenze,
            IGetListaSintesi getListaSintesi,
            GetPinNodoByCodSede getPinNodoByCodSede,
            INotificationDoubleChiamataInCorso notificationDoubleChiamataInCorso)
        {
            _currentUser = currentUser;
            _findUserByUsername = findUserByUsername;
            _getAutorizzazioni = getAutorizzazioni;
            _getCompetenze = getCompetenze;
            _getListaSintesi = getListaSintesi;
            _getPinNodoByCodSede = getPinNodoByCodSede;
            _notificationDoubleChiamataInCorso = notificationDoubleChiamataInCorso;
        }

        public IEnumerable<AuthorizationResult> Authorize(ChiamataInCorsoMarkerCommand command)
        {
            var username = _currentUser.Identity.Name;
            var user = _findUserByUsername.FindUserByUs(username);
            var Competenze = _getCompetenze.GetCompetenzeByCoordinateIntervento(command.AddChiamataInCorso.Localita.Coordinate).ToHashSet();

            if (_currentUser.Identity.IsAuthenticated)
            {
                if (user == null)
                    yield return new AuthorizationResult(Costanti.UtenteNonAutorizzato);

                var listaPin = _getPinNodoByCodSede.GetListaPin(Competenze.ToArray());
                FiltroRicercaRichiesteAssistenza filtro = new FiltroRicercaRichiesteAssistenza()
                {
                    IndirizzoIntervento = command.AddChiamataInCorso.Localita,
                    SearchKey = "0",
                    UnitaOperative = listaPin.ToHashSet()
                };

                var richiesteEsistenti = _getListaSintesi.GetListaSintesiRichieste(filtro);

                if (richiesteEsistenti.Count > 0)
                    _notificationDoubleChiamataInCorso.SendNotification(command);
            }
            else
                yield return new AuthorizationResult(Costanti.UtenteNonAutorizzato);
        }
    }
}
