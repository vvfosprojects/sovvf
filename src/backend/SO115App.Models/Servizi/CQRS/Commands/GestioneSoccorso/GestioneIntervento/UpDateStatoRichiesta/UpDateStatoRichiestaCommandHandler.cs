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
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.AggiornaStatoMezzo;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using System;
using System.Linq;

namespace DomainModel.CQRS.Commands.UpDateStatoRichiesta
{
    public class UpDateStatoRichiestaCommandHandler : ICommandHandler<UpDateStatoRichiestaCommand>
    {
        private readonly IUpDateRichiestaAssistenza _updateRichiestaAssistenza;
        private readonly IGetRichiesta _getRichiestaById;
        private readonly IUpdateStatoPartenze _upDatePartenza;

        public UpDateStatoRichiestaCommandHandler(
            IUpDateRichiestaAssistenza updateRichiestaAssistenza,
            IGetRichiesta getRichiestaById,
            IUpdateStatoPartenze upDatePartenza)
        {
            _updateRichiestaAssistenza = updateRichiestaAssistenza;
            _getRichiestaById = getRichiestaById;
            _upDatePartenza = upDatePartenza;
        }

        public void Handle(UpDateStatoRichiestaCommand command)
        {
            var richiesta = _getRichiestaById.GetById(command.IdRichiesta);

            if (command.Stato.Equals(Costanti.RichiestaChiusa) || command.Stato.Equals(Costanti.RichiestaSospesa))
            {
                foreach (var composizione in richiesta.lstPartenzeInCorso)
                {
                    if (!composizione.Sganciata && !composizione.PartenzaAnnullata)
                    {
                        if (!composizione.Mezzo.Stato.Equals(Costanti.MezzoRientrato) && !composizione.Mezzo.Stato.Equals(Costanti.MezzoInSede))
                        {
                            if (!composizione.Mezzo.Stato.Equals(Costanti.MezzoInSede) || !composizione.Mezzo.Stato.Equals(Costanti.MezzoRientrato))
                                composizione.Mezzo.Stato = Costanti.MezzoRientrato;

                            composizione.Mezzo.IdRichiesta = null;

                            AggiornaStatoMezzoCommand statoMezzo = new AggiornaStatoMezzoCommand();
                            statoMezzo.CodiciSede = new string[] { command.CodiceSede };
                            statoMezzo.IdMezzo = composizione.Mezzo.Codice;
                            statoMezzo.Richiesta = richiesta;
                            statoMezzo.StatoMezzo = Costanti.MezzoRientrato;
                            _upDatePartenza.Update(statoMezzo);
                        }
                    }

                    if (command.Stato.Equals(Costanti.RichiestaChiusa) || command.Stato.Equals(Costanti.RichiestaSospesa))
                        composizione.Terminata = true;
                }
            }

            if (command.EntiIntervenuti != null)
            {
                richiesta.CodEntiIntervenuti = command.EntiIntervenuti.Select(x => x.Codice).ToList();
            }

            richiesta.SincronizzaStatoRichiesta(command.Stato, richiesta.StatoRichiesta, command.IdOperatore, command.Motivazione.ToString(), DateTime.UtcNow, command.EntiIntervenuti);

            if (command.Stato == Costanti.RichiestaRiaperta)
                richiesta.IstanteChiusura = null;

            command.Richiesta = richiesta;

            _updateRichiestaAssistenza.UpDate(richiesta);
        }
    }
}
