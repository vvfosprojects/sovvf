﻿//-----------------------------------------------------------------------
// <copyright file="AggiornaStatoMezzoCommandHandler.cs" company="CNVVF">
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
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using System.Linq;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.AggiornaStatoMezzo
{
    public class AggiornaStatoMezzoCommandHandler : ICommandHandler<AggiornaStatoMezzoCommand>
    {
        private readonly IUpdateStatoPartenze _updateStatoPartenze;
        private AggiornaStatoMezzoCommandHandler() { }
        public AggiornaStatoMezzoCommandHandler(IUpdateStatoPartenze updateStatoPartenze) => _updateStatoPartenze = updateStatoPartenze;

        public void Handle(AggiornaStatoMezzoCommand command)
        {
            var richiesta = command.Richiesta;
            var data = command.DataOraAggiornamento;

            var partenzaDaLavorare = richiesta.Partenze.FirstOrDefault(p => p.Partenza.Mezzo.Codice.Equals(command.IdMezzo));

            richiesta.CambiaStatoPartenza(partenzaDaLavorare.Partenza, new CambioStatoMezzo()
            {
                CodMezzo = command.IdMezzo,
                DataOraAggiornamento = data,
                Stato = command.StatoMezzo
            });

            //if (richiesta.StatoRichiesta is Sospesa)
                //new ChiusuraRichiesta("", richiesta, dataAdesso.AddSeconds(1), richiesta.CodOperatore);

            _updateStatoPartenze.Update(new AggiornaStatoMezzoCommand()
            {
                CodiciSede = command.CodiciSede,
                CodRichiesta = richiesta.Codice,
                Richiesta = richiesta,
                IdUtente = command.IdUtente,
                DataOraAggiornamento = data,
                StatoMezzo = command.StatoMezzo,
                IdMezzo = command.IdMezzo
            });
        }
    }
}