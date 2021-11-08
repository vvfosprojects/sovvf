//-----------------------------------------------------------------------
// <copyright file="UpdateEmergenzaCommandHandler.cs" company="CNVVF">
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

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneEmergenza.UpdateEmergenza
{
    public class UpdateEmergenzaCommandHandler : ICommandHandler<UpdateEmergenzaCommand>
    {
        private readonly IUpDateEmergenza _upDateEmergenza;
        private readonly IGetEmergenzaById _getEmergenza;

        public UpdateEmergenzaCommandHandler(IUpDateEmergenza upDateEmergenza, IGetEmergenzaById getEmergenza)
        {
            _upDateEmergenza = upDateEmergenza;
            _getEmergenza = getEmergenza;
        }

        public void Handle(UpdateEmergenzaCommand command)
        {
            var emergenza = _getEmergenza.Get(command.InfoEmergenza.Id);

            foreach (var evento in emergenza.ListaEventi)
                command.InfoEmergenza.AddEvento(evento);
            
            command.InfoEmergenza.AddEvento(new ModificaEmergenza(DateTime.UtcNow, command.InfoEmergenza.CodEmergenza, command.CodOperatore, String.Join(",", command.InfoEmergenza.Tipologia.emergenza)));

            if (emergenza.ListaModuli == null && command.InfoEmergenza.ListaModuli != null)
            {
                command.InfoEmergenza.AddEvento(new PresaInCaricoEmergenza(DateTime.UtcNow, command.InfoEmergenza.CodEmergenza, command.CodOperatore, command.InfoEmergenza.CodSedePresaInCarico));
                command.InfoEmergenza.AddEvento(new InserimentoModuliColonnaMobileEmergenza(DateTime.UtcNow, command.InfoEmergenza.CodEmergenza, command.CodOperatore, command.InfoEmergenza.CodSedePresaInCarico));                
            }

            _upDateEmergenza.Update(command.InfoEmergenza);
        }
    }
}
