//-----------------------------------------------------------------------
// <copyright file="AddInterventoCommandHandler.cs" company="CNVVF">
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
using SO115App.API.Models.Classi.Soccorso.Eventi.Partenze;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using System;
using SO115App.API.Models.Classi.Soccorso.Eventi;

namespace DomainModel.CQRS.Commands.GestrionePartenza.AggiornaStatoMezzo
{
    public class AggiornaStatoMezzoCommandHandler : ICommandHandler<AggiornaStatoMezzoCommand>
    {
        private readonly IGetRichiestaById _getRichiestaById;
        private readonly IUpdateStatoPartenze _updateStatoPartenze;
        private bool _mezziTuttiInSede = true;

        public AggiornaStatoMezzoCommandHandler(
            IGetRichiestaById getRichiestaById,
            IUpdateStatoPartenze updateStatoPartenze
            )
        {
            _getRichiestaById = getRichiestaById;
            _updateStatoPartenze = updateStatoPartenze;
        }

        public void Handle(AggiornaStatoMezzoCommand command)
        {
            RichiestaAssistenza richiesta = _getRichiestaById.Get(command.Chiamata.Id);

            if (command.StatoMezzo == "Sul Posto")
            {
                new ArrivoSulPosto(richiesta, command.IdMezzo, DateTime.UtcNow, richiesta.Operatore.Id);

                richiesta.SincronizzaStatoRichiesta("Presidiata", richiesta.StatoRichiesta, richiesta.Operatore.Id, "");

                foreach (var composizione in richiesta.Partenze)
                {
                    if (composizione.Partenza.Mezzo.Codice == command.IdMezzo)
                    {
                        composizione.Partenza.Mezzo.Stato = "Sul Posto";
                    }
                }
            }
            else if (command.StatoMezzo == "In Rientro")
            {
                new PartenzaInRientro(richiesta, command.IdMezzo, DateTime.UtcNow, richiesta.Operatore.Id);

                foreach (var composizione in richiesta.Partenze)
                {
                    if (composizione.Partenza.Mezzo.Codice == command.IdMezzo)
                    {
                        composizione.Partenza.Mezzo.Stato = "In Rientro";
                    }
                }

                foreach (var composizione in richiesta.Partenze)
                {
                    if (composizione.Partenza.Mezzo.Stato != "In Sede" && composizione.Partenza.Mezzo.Stato != "In Rientro")
                    {
                        _mezziTuttiInSede = false;
                    }
                }

                //if (_mezziTuttiInSede)
                //    richiesta.SincronizzaStatoRichiesta("Chiusa", richiesta.StatoRichiesta, richiesta.Operatore.Id, "");
            }
            else if (command.StatoMezzo == "Rientrato")
            {
                new PartenzaRientrata(richiesta, command.IdMezzo, DateTime.UtcNow, richiesta.Operatore.Id);

                foreach (var composizione in richiesta.Partenze)
                {
                    if (composizione.Partenza.Mezzo.Codice == command.IdMezzo)
                    {
                        composizione.Partenza.Mezzo.Stato = "In Sede";
                    }
                }

                foreach (var composizione in richiesta.Partenze)
                {
                    if (composizione.Partenza.Mezzo.Stato != "In Sede" && composizione.Partenza.Mezzo.Stato != "In Rientro")
                    {
                        _mezziTuttiInSede = false;
                    }
                }

                //if (_mezziTuttiInSede)
                //    richiesta.SincronizzaStatoRichiesta("Chiusa", richiesta.StatoRichiesta, richiesta.Operatore.Id, "");
            }
            else if (command.StatoMezzo == "In Viaggio")
            {

                foreach (var composizione in richiesta.Partenze)
                {
                    if (composizione.Partenza.Mezzo.Codice == command.IdMezzo)
                    {
                        composizione.Partenza.Mezzo.Stato = "In Viaggio";
                    }
                    
                }

            }

            command.richiesta = richiesta;

            _updateStatoPartenze.Update(command);
        }
    }
}
