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
using SO115App.API.Models.Classi.Soccorso.Eventi;
using SO115App.API.Models.Classi.Soccorso.Eventi.Partenze;
using SO115App.API.Models.Classi.Soccorso.StatiRichiesta;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using System;
using System.Linq;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.AggiornaStatoMezzo
{
    public class AggiornaStatoMezzoCommandHandler : ICommandHandler<AggiornaStatoMezzoCommand>
    {
        private readonly IUpdateStatoPartenze _updateStatoPartenze;

        public AggiornaStatoMezzoCommandHandler(IUpdateStatoPartenze updateStatoPartenze) => _updateStatoPartenze = updateStatoPartenze;

        public void Handle(AggiornaStatoMezzoCommand command)
        {
            var richiesta = command.Richiesta;

            //TODO DA TOGLIERE
            if (command.DataOraAggiornamento == null || command.DataOraAggiornamento == DateTime.MinValue)
                command.DataOraAggiornamento = DateTime.UtcNow;

            var partenzaDaLavorare = richiesta.Partenze.FirstOrDefault(p => p.Partenza.Mezzo.Codice.Equals(command.IdMezzo));

            #region SWITCH STATO MEZZI

            if (command.StatoMezzo == Costanti.MezzoInViaggio)
            {
                new UscitaPartenza(richiesta, command.IdMezzo, command.DataOraAggiornamento, richiesta.CodOperatore);

                richiesta.SincronizzaStatoRichiesta(Costanti.RichiestaAssegnata, richiesta.StatoRichiesta,
                    richiesta.CodOperatore, "", command.DataOraAggiornamento);

                partenzaDaLavorare.Partenza.Mezzo.Stato = Costanti.MezzoInViaggio;
                partenzaDaLavorare.Partenza.Mezzo.IdRichiesta = richiesta.Id;
            }

            else if (command.StatoMezzo == Costanti.MezzoSulPosto)
            {
                new ArrivoSulPosto(richiesta, command.IdMezzo, command.DataOraAggiornamento, richiesta.CodOperatore);

                richiesta.SincronizzaStatoRichiesta(Costanti.RichiestaPresidiata, richiesta.StatoRichiesta,
                    richiesta.CodOperatore, "", command.DataOraAggiornamento);

                partenzaDaLavorare.Partenza.Mezzo.Stato = Costanti.MezzoSulPosto;
                partenzaDaLavorare.Partenza.Mezzo.IdRichiesta = richiesta.Id;
            }

            else if (command.StatoMezzo == Costanti.MezzoInRientro)
            {
                partenzaDaLavorare.Partenza.Mezzo.Stato = Costanti.MezzoInRientro;

                new PartenzaInRientro(richiesta, partenzaDaLavorare.Partenza.Mezzo.Codice, command.DataOraAggiornamento, richiesta.CodOperatore);

                if (richiesta.lstPartenze.Select(p => p.Mezzo.Stato).All(s => s != Costanti.MezzoInSede && s != Costanti.MezzoInViaggio && s != Costanti.MezzoInUscita && s != Costanti.MezzoSulPosto))
                    new ChiusuraRichiesta("", richiesta, command.DataOraAggiornamento, richiesta.CodOperatore);
            }

            else if (command.StatoMezzo == Costanti.MezzoRientrato)
            {
                partenzaDaLavorare.Partenza.Mezzo.Stato = Costanti.MezzoInSede;
                partenzaDaLavorare.Partenza.Mezzo.IdRichiesta = null;
                partenzaDaLavorare.Partenza.Terminata = true;

                new PartenzaRientrata(richiesta, partenzaDaLavorare.Partenza.Mezzo.Codice, command.DataOraAggiornamento, richiesta.CodOperatore);

                if (richiesta.lstPartenze.Select(p => p.Mezzo.Stato).All(s => s != Costanti.MezzoInSede && s != Costanti.MezzoInViaggio && s != Costanti.MezzoInUscita && s != Costanti.MezzoSulPosto))
                    new ChiusuraRichiesta("", richiesta, command.DataOraAggiornamento, richiesta.CodOperatore);
            }

            else if (command.StatoMezzo == Costanti.MezzoInViaggio)
            {
                partenzaDaLavorare.Partenza.Mezzo.Stato = Costanti.MezzoInViaggio;
                partenzaDaLavorare.Partenza.Mezzo.IdRichiesta = richiesta.Id;
            }

            #endregion

            if (richiesta.StatoRichiesta is Sospesa)
                new ChiusuraRichiesta("", richiesta, command.DataOraAggiornamento, richiesta.CodOperatore);

            foreach (var squadra in partenzaDaLavorare.Partenza.Squadre)
                squadra.Stato = MappaStatoSquadraDaStatoMezzo.MappaStato(command.StatoMezzo);

            _updateStatoPartenze.Update(new AggiornaStatoMezzoCommand()
            {
                CodiceSede = command.CodiceSede,
                CodRichiesta = richiesta.Codice,
                Richiesta = richiesta,
                IdUtente = command.IdUtente,
                DataOraAggiornamento = command.DataOraAggiornamento,
                StatoMezzo = command.StatoMezzo,
                IdMezzo = command.IdMezzo
            });
        }
    }
}