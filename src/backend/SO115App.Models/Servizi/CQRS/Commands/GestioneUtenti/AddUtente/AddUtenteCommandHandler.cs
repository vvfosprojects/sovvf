//-----------------------------------------------------------------------
// <copyright file="AddUtenteCommandHandler.cs" company="CNVVF">
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
using SO115App.API.Models.Classi.Autenticazione;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Organigramma;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Personale;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using System;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneUtenti.AddUtente
{
    /// <summary>
    ///   l'handler che si occupa della logica di aggiunta di un utente come operatore
    /// </summary>
    public class AddUtenteCommandHandler : ICommandHandler<AddUtenteCommand>
    {
        private readonly IAddUtente _addUtente;
        private readonly IGetPersonaleByCF _personaleByCF;
        private readonly IGetAlberaturaUnitaOperative _getAlberaturaUnitaOperative;
        private readonly IGetListaDistaccamentiByCodiceSede _getListaDistaccamentiByCodiceSede;
        private readonly IGetDistaccamentoByCodiceSedeUC _getDistaccamentoByCodiceSede;

        public AddUtenteCommandHandler(IAddUtente addUtente, IGetPersonaleByCF personaleByCF, IGetAlberaturaUnitaOperative getAlberaturaUnitaOperative, IGetListaDistaccamentiByCodiceSede getListaDistaccamentiByCodiceSede, IGetDistaccamentoByCodiceSedeUC getDistaccamentoByCodiceSede)
        {
            _addUtente = addUtente;
            _personaleByCF = personaleByCF;
            _getAlberaturaUnitaOperative = getAlberaturaUnitaOperative;
            _getListaDistaccamentiByCodiceSede = getListaDistaccamentiByCodiceSede;
            _getDistaccamentoByCodiceSede = getDistaccamentoByCodiceSede;
        }

        /// <summary>
        ///   metodo della classe
        /// </summary>
        /// <param name="command">il command con i parametri di ingresso</param>
        public void Handle(AddUtenteCommand command)
        {
            var personale = _personaleByCF.Get(command.CodFiscale).Result;
            var listaPin = new List<PinNodo>();
            var sediAlberate = _getAlberaturaUnitaOperative.ListaSediAlberata();
            var distaccamento = _getDistaccamentoByCodiceSede.Get(personale.CodSede).Result;
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
            var utenteVVF = new Utente(command.CodFiscale, personale.Nominativo.Split(".")[0], personale.Nominativo.Split(".")[1])
            {
                Ruoli = command.Ruoli,
                Username = personale.Nominativo.ToLower(),
                Password = "test",
                Sede = new Sede($"{distaccamento.CodSede}.{distaccamento.CodDistaccamento}", distaccamento.DescDistaccamento, distaccamento.Indirizzo, distaccamento.Coordinate, "", "", "", "", "")
            };

            _addUtente.Add(utenteVVF);
        }
    }
}
