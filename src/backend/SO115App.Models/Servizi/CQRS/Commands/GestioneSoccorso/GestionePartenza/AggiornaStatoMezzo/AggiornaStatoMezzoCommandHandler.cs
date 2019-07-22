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
using SO115App.Models.Classi.Utility;

namespace DomainModel.CQRS.Commands.GestrionePartenza.AggiornaStatoMezzo
{
    public class AggiornaStatoMezzoCommandHandler : ICommandHandler<AggiornaStatoMezzoCommand>
    {
        private readonly IGetRichiestaById _getRichiestaById;
        private readonly IUpdateStatoPartenze _updateStatoPartenze;
        private bool _mezziTuttiInSede = true;
        private readonly Costanti _costanti = new Costanti();

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

            if (command.StatoMezzo == _costanti.MezzoSulPosto)
            {
                new ArrivoSulPosto(richiesta, command.IdMezzo, DateTime.UtcNow, richiesta.Operatore.Id);

                richiesta.SincronizzaStatoRichiesta(_costanti.RichiestaPresidiata, richiesta.StatoRichiesta, richiesta.Operatore.Id, "");

                foreach (var composizione in richiesta.Partenze)
                {
                    if (composizione.Partenza.Mezzo.Codice == command.IdMezzo)
                    {
                        composizione.Partenza.Mezzo.Stato = _costanti.MezzoSulPosto;
                    }
                }
            }
            else if (command.StatoMezzo == _costanti.MezzoInRientro)
            {
                new PartenzaInRientro(richiesta, command.IdMezzo, DateTime.UtcNow, richiesta.Operatore.Id);

                foreach (var composizione in richiesta.Partenze)
                {
                    if (composizione.Partenza.Mezzo.Codice == command.IdMezzo)
                    {
                        composizione.Partenza.Mezzo.Stato = _costanti.MezzoInRientro;
                    }
                }

                foreach (var composizione in richiesta.Partenze)
                {
                    if (composizione.Partenza.Mezzo.Stato != _costanti.MezzoInSede && composizione.Partenza.Mezzo.Stato != _costanti.MezzoInRientro)
                    {
                        _mezziTuttiInSede = false;
                    }
                }

                //if (_mezziTuttiInSede)
                //    richiesta.SincronizzaStatoRichiesta("Chiusa", richiesta.StatoRichiesta, richiesta.Operatore.Id, "");
            }
            else if (command.StatoMezzo == _costanti.MezzoRientrato)
            {
                new PartenzaRientrata(richiesta, command.IdMezzo, DateTime.UtcNow, richiesta.Operatore.Id);

                foreach (var composizione in richiesta.Partenze)
                {
                    if (composizione.Partenza.Mezzo.Codice == command.IdMezzo)
                    {
                        composizione.Partenza.Mezzo.Stato = _costanti.MezzoInSede;
                    }
                }

                foreach (var composizione in richiesta.Partenze)
                {
                    if (composizione.Partenza.Mezzo.Stato != _costanti.MezzoInSede && composizione.Partenza.Mezzo.Stato != _costanti.MezzoInRientro)
                    {
                        _mezziTuttiInSede = false;
                    }
                }

                //if (_mezziTuttiInSede)
                //    richiesta.SincronizzaStatoRichiesta("Chiusa", richiesta.StatoRichiesta, richiesta.Operatore.Id, "");
            }
            else if (command.StatoMezzo == _costanti.MezzoInViaggio)
            {

                foreach (var composizione in richiesta.Partenze)
                {
                    if (composizione.Partenza.Mezzo.Codice == command.IdMezzo)
                    {
                        composizione.Partenza.Mezzo.Stato = _costanti.MezzoInViaggio;
                    }
                    
                }

            }

            command.Richiesta = richiesta;

            _updateStatoPartenze.Update(command);
        }
    }
}
