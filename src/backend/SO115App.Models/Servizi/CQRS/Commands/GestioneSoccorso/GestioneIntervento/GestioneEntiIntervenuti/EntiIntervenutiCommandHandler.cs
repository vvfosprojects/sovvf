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
using DomainModel.CQRS.Commands.GestioneFonogramma;
using SO115App.API.Models.Classi.Soccorso.Eventi.Fonogramma;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Classi.Soccorso.Eventi;
using SO115App.Models.Servizi.Infrastruttura.GestioneRubrica.Enti;
using System;
using System.Linq;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneIntervento.GestioneEntiIntervenuti
{
    public class EntiIntervenutiCommandHandler : ICommandHandler<EntiIntervenutiCommand>
    {
        private readonly IUpDateRichiestaAssistenza _saveRichiestaAssistenza;
        private readonly IGetRubrica _getRurbica;

        public EntiIntervenutiCommandHandler(IUpDateRichiestaAssistenza saveRichiestaAssistenza, IGetRubrica getRurbica)
        {
            _saveRichiestaAssistenza = saveRichiestaAssistenza;
            _getRurbica = getRurbica;
        }

        public void Handle(EntiIntervenutiCommand command)
        {
            int[] listacodici = new int[1];
            listacodici = command.idEnteIntervenuto;
            var rublica = _getRurbica.GetBylstCodici(listacodici);

            if (command.Richiesta.CodEntiIntervenuti != null)
                command.Richiesta.CodEntiIntervenuti.Clear();

            command.Richiesta.CodEntiIntervenuti = new System.Collections.Generic.List<int>();
            command.Richiesta.CodEntiIntervenuti.AddRange(rublica.Select(x => x.Codice));

            foreach (var ente in rublica)
            {
                if (command.Richiesta.Eventi.ToList().FindAll(x => x is InserimentoEnteIntervenuto).Count > 0)
                {
                    var eventiPrecedenti = command.Richiesta.Eventi.ToList().FindAll(x => x is InserimentoEnteIntervenuto).ToList();
                    bool nuovo = true;
                    foreach (var evento in eventiPrecedenti)
                    {
                        if (((InserimentoEnteIntervenuto)evento).Note.Contains(ente.Codice.ToString()))
                            nuovo = false;
                    }

                    //if (nuovo)
                    new InserimentoEnteIntervenuto(command.Richiesta, DateTime.Now, command.IdOperatore, ente.Descrizione + " (cod. " + ente.Codice + ")", command.CodSede);
                }else
                    new InserimentoEnteIntervenuto(command.Richiesta, DateTime.Now, command.IdOperatore, ente.Descrizione + " (cod. " + ente.Codice + ")", command.CodSede);

            }

            this._saveRichiestaAssistenza.UpDate(command.Richiesta);
        }
    }
}
