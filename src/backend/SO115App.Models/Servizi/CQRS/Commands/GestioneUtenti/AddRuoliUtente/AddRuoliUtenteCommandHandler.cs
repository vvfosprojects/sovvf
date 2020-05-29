//-----------------------------------------------------------------------
// <copyright file="AddRuoliUtenteCommandHandler.cs" company="CNVVF">
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
using SO115App.API.Models.Classi.Organigramma;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti.GestioneRuolo;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti.GetUtenti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneUtenti.AddRuoliUtente
{
    /// <summary>
    ///   classe che si occupa di gestire la logica per l'aggiunta dei ruoli agli operatori
    /// </summary>
    public class AddRuoliUtenteCommandHandler : ICommandHandler<AddRuoliUtenteCommand>
    {
        private readonly IAddRuoli _addRuoli;
        private readonly IGetAlberaturaUnitaOperative _getAlberaturaUnitaOperative;

        public AddRuoliUtenteCommandHandler(IAddRuoli addRuoli, IGetAlberaturaUnitaOperative getAlberaturaUnitaOperative)
        {
            _addRuoli = addRuoli;
            _getAlberaturaUnitaOperative = getAlberaturaUnitaOperative;
        }

        /// <summary>
        ///   metodo handler
        /// </summary>
        /// <param name="command">il command con i parametri di input</param>
        public void Handle(AddRuoliUtenteCommand command)
        {
            var listaPin = new List<PinNodo>();
            var sediAlberate = _getAlberaturaUnitaOperative.ListaSediAlberata();

            foreach (var ruolo in command.Ruoli)
            {
                listaPin.Add(new PinNodo(ruolo.CodSede, ruolo.Ricorsivo));
                foreach (var figli in sediAlberate.GetSottoAlbero(listaPin))
                {
                    if (figli.Codice.Equals(ruolo.CodSede))
                    {
                        ruolo.DescSede = figli.Nome;
                    }
                }
            }
            _addRuoli.Add(command.CodFiscale, command.Ruoli);
        }
    }
}
