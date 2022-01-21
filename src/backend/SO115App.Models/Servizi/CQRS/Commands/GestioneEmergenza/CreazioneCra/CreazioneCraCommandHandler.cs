//-----------------------------------------------------------------------
// <copyright file="CreazioneCraCommandHandler.cs" company="CNVVF">
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
using SO115App.Models.Classi.Soccorso.Eventi.Emergenza;
using SO115App.Models.Servizi.Infrastruttura.GestioneEmergenza;
using System;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneEmergenza.CreazioneCra
{
    public class CreazioneCraCommandHandler : ICommandHandler<CreazioneCraCommand>
    {
        private readonly IUpDateEmergenza _upDateEmergenza;
        private readonly IGetEmergenzaById _getEmergenza;

        public CreazioneCraCommandHandler(IUpDateEmergenza upDateEmergenza, IGetEmergenzaById getEmergenza)
        {
            _upDateEmergenza = upDateEmergenza;
            _getEmergenza = getEmergenza;
        }

        public void Handle(CreazioneCraCommand command)
        {
            var emergenza = _getEmergenza.Get(command.IdEmergenza);

            emergenza.AddEvento(new CreazioneCraCon(DateTime.UtcNow, command.CodOperatore, emergenza.CodEmergenza, emergenza.CodSedePresaInCarico, command.Cra));

            if (command.istanteRichiestaCra != null)
            {
                foreach (var evento in emergenza.ListaEventi)
                {
                    if (evento is RichiestaCreazioneCRAEmergenza)
                    {
                        if (evento.Istante.Equals(command.istanteRichiestaCra))
                        {
                            ((RichiestaCreazioneCRAEmergenza)evento).Gestita = true;
                            ((RichiestaCreazioneCRAEmergenza)evento).istanteGestione = DateTime.Now;
                        }
                    }
                }
            }

            command.Emergenza = emergenza;
            _upDateEmergenza.Update(emergenza);
        }
    }
}
