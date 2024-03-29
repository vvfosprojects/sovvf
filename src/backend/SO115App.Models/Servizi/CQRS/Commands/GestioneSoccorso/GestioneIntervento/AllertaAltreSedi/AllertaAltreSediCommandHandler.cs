﻿//-----------------------------------------------------------------------
// <copyright file="AllertaAltreSediCommandHandler.cs" company="CNVVF">
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

using CQRS.Commands;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Classi.Soccorso.Eventi;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.IdentityManagement;
using System;
using System.Linq;

namespace DomainModel.CQRS.Commands.AllertaAltreSedi
{
    public class AllertaAltreSediCommandHandler : ICommandHandler<AllertaAltreSediCommand>
    {
        private readonly IUpDateRichiestaAssistenza _updateRichiestaAssistenza;
        private readonly IGetRichiesta _getRichiestaById;
        private readonly IGetDistaccamentoByCodiceSede _getSede;

        public AllertaAltreSediCommandHandler(
            IUpDateRichiestaAssistenza updateRichiestaAssistenza,
            IGetRichiesta getRichiestaById,
            IGetDistaccamentoByCodiceSede getSede)
        {
            _updateRichiestaAssistenza = updateRichiestaAssistenza;
            _getRichiestaById = getRichiestaById;
            _getSede = getSede;
        }

        public void Handle(AllertaAltreSediCommand command)
        {
            var richiesta = _getRichiestaById.GetByCodice(command.CodiceRichiesta);

            var lstSedi = command.CodSediAllertate.Select(s => _getSede.GetSede(s).Descrizione).ToList();
            if (!lstSedi.All(s => s.ToUpper().Contains("CENTRALE")))
                throw new Exception("1* E' possibile allertare solo i comandi");

            if (richiesta.CodSOAllertate != null && richiesta.CodSOAllertate.Count > 0)
                command.CodSediAllertateOld = richiesta.CodSOAllertate.ToArray();

            richiesta.CodSOAllertate = command.CodSediAllertate.ToHashSet();

            new AllertaSedi(richiesta, DateTime.UtcNow, command.CodUtente, "Allerta", command.CodSediAllertate);

            _updateRichiestaAssistenza.UpDate(richiesta);
        }
    }
}
