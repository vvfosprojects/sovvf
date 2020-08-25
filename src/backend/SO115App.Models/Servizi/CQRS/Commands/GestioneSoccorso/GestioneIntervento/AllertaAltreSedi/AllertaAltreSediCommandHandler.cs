//-----------------------------------------------------------------------
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
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Classi.Soccorso.Eventi;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.ComposizioneMezzi;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Classi.Soccorso.Eventi;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using System;
using System.Collections.Generic;
using System.Linq;

namespace DomainModel.CQRS.Commands.AllertaAltreSedi
{
    public class AllertaAltreSediCommandHandler : ICommandHandler<AllertaAltreSediCommand>
    {
        private readonly IUpDateRichiestaAssistenza _updateRichiestaAssistenza;
        private readonly IGetRichiestaById _getRichiestaById;

        public AllertaAltreSediCommandHandler(
            IUpDateRichiestaAssistenza updateRichiestaAssistenza,
            IGetRichiestaById getRichiestaById)
        {
            _updateRichiestaAssistenza = updateRichiestaAssistenza;
            _getRichiestaById = getRichiestaById;
        }

        public void Handle(AllertaAltreSediCommand command)
        {
            var richiesta = _getRichiestaById.GetByCodice(command.CodiceRichiesta);

            if (richiesta.CodSOAllertate != null && richiesta.CodSOAllertate.Count > 0)
                command.CodSediAllertateOld = richiesta.CodSOAllertate.ToArray();

            richiesta.CodSOAllertate = command.CodSediAllertate.ToHashSet();

            new AllertaSedi(richiesta, DateTime.UtcNow, command.CodUtente, "Allerta", command.CodSediAllertate);

            _updateRichiestaAssistenza.UpDate(richiesta);
        }
    }
}
