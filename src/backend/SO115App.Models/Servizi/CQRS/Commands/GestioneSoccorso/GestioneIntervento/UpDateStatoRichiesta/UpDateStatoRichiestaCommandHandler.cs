//-----------------------------------------------------------------------
// <copyright file="UpDateInterventoCommandHandler.cs" company="CNVVF">
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
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;

namespace DomainModel.CQRS.Commands.UpDateStatoRichiesta
{
    public class UpDateStatoRichiestaCommandHandler : ICommandHandler<UpDateStatoRichiestaCommand>
    {
        private readonly IUpDateRichiestaAssistenza _updateRichiestaAssistenza;
        private readonly IGetRichiestaById _getRichiestaById;

        public UpDateStatoRichiestaCommandHandler(
            IUpDateRichiestaAssistenza updateRichiestaAssistenza,
            IGetRichiestaById getRichiestaById)
        {
            _updateRichiestaAssistenza = updateRichiestaAssistenza;
            _getRichiestaById = getRichiestaById;
        }

        public void Handle(UpDateStatoRichiestaCommand command)
        {
            var richiesta = _getRichiestaById.Get(command.IdRichiesta);

            if (command.Stato.Equals(Costanti.RichiestaChiusa) || command.Stato.Equals(Costanti.RichiestaSospesa))
            {
                foreach (var composizione in richiesta.Partenze)
                {
                    if (!composizione.Partenza.Mezzo.Stato.Equals(Costanti.MezzoInRientro) && !composizione.Partenza.Mezzo.Stato.Equals(Costanti.MezzoInSede))
                    {
                        composizione.Partenza.Mezzo.Stato = Costanti.MezzoInRientro;
                    }
                }
            }

            richiesta.SincronizzaStatoRichiesta(command.Stato, richiesta.StatoRichiesta, command.IdOperatore, command.Note);

            _updateRichiestaAssistenza.UpDate(richiesta);
        }
    }
}
