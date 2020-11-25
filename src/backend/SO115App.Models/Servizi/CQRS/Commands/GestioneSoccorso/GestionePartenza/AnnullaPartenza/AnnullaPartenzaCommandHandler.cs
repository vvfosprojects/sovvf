//-----------------------------------------------------------------------
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
using SO115App.API.Models.Classi.Soccorso.Eventi.Partenze;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.AggiornaStatoMezzo;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.GenerazioneCodiciRichiesta;
using System;
using System.Linq;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.AnnullaPartenza
{
    public class AnnullaPartenzaCommandHandler : ICommandHandler<AnnullaPartenzaCommand>
    {
        private readonly IGetRichiestaById _getRichiestaById;
        private readonly IUpDateRichiestaAssistenza _upDateRichiestaAssistenza;
        private readonly IUpdateStatoPartenze _updateStatoPartenze;
        private readonly IGeneraCodiceRichiesta _generatoreCodici;

        public AnnullaPartenzaCommandHandler(
            IGetRichiestaById getRichiestaById,
            IUpDateRichiestaAssistenza upDateRichiestaAssistenza,
            IUpdateStatoPartenze updateStatoPartenze,
            IGeneraCodiceRichiesta generatoreCodici
        )
        {
            _getRichiestaById = getRichiestaById;
            _upDateRichiestaAssistenza = upDateRichiestaAssistenza;
            _updateStatoPartenze = updateStatoPartenze;
            _generatoreCodici = generatoreCodici;
        }

        public void Handle(AnnullaPartenzaCommand command)
        {
            var PartenzaToDelete = command.Richiesta.Partenze.Where(x => x.Partenza.Mezzo.Codice.Equals(command.TargaMezzo)).FirstOrDefault();

            var nuovoCodicePartenza = _generatoreCodici.GeneraCodicePartenza();

            switch (command.CodMotivazione)
            {
                case 1:
                    new RevocaPerInterventoNonPiuNecessario(command.Richiesta, command.TargaMezzo, DateTime.Now, command.IdOperatore, nuovoCodicePartenza);
                    break;

                case 2:
                    var richiestaSubentrata = _getRichiestaById.GetByCodice(command.CodRichiestaSubentrata);
                    if (richiestaSubentrata == null)
                        richiestaSubentrata = _getRichiestaById.GetByCodiceRichiesta(command.CodRichiestaSubentrata);

                    new RevocaPerRiassegnazione(command.Richiesta, richiestaSubentrata, command.TargaMezzo, DateTime.Now, command.IdOperatore, nuovoCodicePartenza);
                    break;

                case 3:
                    new RevocaPerFuoriServizio(command.Richiesta, command.TargaMezzo, DateTime.Now, command.IdOperatore, nuovoCodicePartenza);
                    break;

                case 4:
                    new RevocaPerAltraMotivazione(command.Richiesta, command.TargaMezzo, DateTime.Now, command.IdOperatore, command.TestoMotivazione, nuovoCodicePartenza);
                    break;
            }
            _upDateRichiestaAssistenza.UpDate(command.Richiesta);

            AggiornaStatoMezzoCommand commandStatoMezzo = new AggiornaStatoMezzoCommand();
            commandStatoMezzo.CodiciSede = new string[] { PartenzaToDelete.Partenza.Mezzo.Distaccamento.Codice };
            commandStatoMezzo.IdMezzo = command.TargaMezzo;
            commandStatoMezzo.StatoMezzo = Costanti.MezzoInSede;
            commandStatoMezzo.Richiesta = command.Richiesta;
            _updateStatoPartenze.Update(commandStatoMezzo);
        }
    }
}
