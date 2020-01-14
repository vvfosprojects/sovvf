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
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using System;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.AggiornaStatoMezzo
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
            var richiesta = _getRichiestaById.Get(command.Chiamata.Id);

            if (command.StatoMezzo == Costanti.MezzoSulPosto)
            {
                new ArrivoSulPosto(richiesta, command.IdMezzo, DateTime.UtcNow, richiesta.CodOperatore);

                richiesta.SincronizzaStatoRichiesta(Costanti.RichiestaPresidiata, richiesta.StatoRichiesta,
                    richiesta.CodOperatore, "");

                foreach (var composizione in richiesta.Partenze)
                {
                    if (composizione.Partenza.Mezzo.Codice == command.IdMezzo)
                    {
                        composizione.Partenza.Mezzo.Stato = Costanti.MezzoSulPosto;
                        composizione.Partenza.Mezzo.IdRichiesta = richiesta.CodRichiesta;
                    }
                }
            }
            else if (command.StatoMezzo == Costanti.MezzoInRientro)
            {
                foreach (var composizione in richiesta.Partenze)
                {
                    if (composizione.Partenza.Mezzo.Codice == command.IdMezzo)
                    {
                        composizione.Partenza.Mezzo.Stato = Costanti.MezzoInRientro;
                        composizione.Partenza.Mezzo.IdRichiesta = null;
                    }
                }

                foreach (var composizione in richiesta.Partenze)
                {
                    if (composizione.Partenza.Mezzo.Stato == Costanti.MezzoSulPosto
                        || composizione.Partenza.Mezzo.Stato == Costanti.MezzoInViaggio)
                    {
                        _mezziTuttiInSede = false;
                    }
                }

                if (_mezziTuttiInSede)
                    new PartenzaInRientro(richiesta, command.IdMezzo, DateTime.UtcNow, richiesta.CodOperatore);
            }
            else if (command.StatoMezzo == Costanti.MezzoRientrato)
            {
                foreach (var composizione in richiesta.Partenze)
                {
                    if (composizione.Partenza.Mezzo.Codice == command.IdMezzo)
                    {
                        composizione.Partenza.Mezzo.Stato = Costanti.MezzoInSede;
                        composizione.Partenza.Mezzo.IdRichiesta = null;
                    }
                }

                foreach (var composizione in richiesta.Partenze)
                {
                    if (composizione.Partenza.Mezzo.Stato != Costanti.MezzoInSede
                        && composizione.Partenza.Mezzo.Stato != Costanti.MezzoInRientro
                        && composizione.Partenza.Mezzo.Stato != Costanti.MezzoRientrato)
                    {
                        _mezziTuttiInSede = false;
                    }
                }

                if (_mezziTuttiInSede)
                    new PartenzaRientrata(richiesta, command.IdMezzo, DateTime.UtcNow, richiesta.CodOperatore);
            }
            else if (command.StatoMezzo == Costanti.MezzoInViaggio)
            {
                foreach (var composizione in richiesta.Partenze)
                {
                    if (composizione.Partenza.Mezzo.Codice == command.IdMezzo)
                    {
                        composizione.Partenza.Mezzo.Stato = Costanti.MezzoInViaggio;
                        composizione.Partenza.Mezzo.IdRichiesta = richiesta.CodRichiesta;
                    }
                }
            }

            foreach (var composizione in richiesta.Partenze)
            {
                if (composizione.Partenza.Mezzo.Codice == command.IdMezzo)
                {
                    foreach (var squadra in composizione.Partenza.Squadre)
                    {
                        {
                            squadra.Stato = MappaStatoSquadraDaStatoMezzo.MappaStato(command.StatoMezzo);
                        }
                    }
                }

                command.Richiesta = richiesta;

                _updateStatoPartenze.Update(command);
            }
        }
    }
}
