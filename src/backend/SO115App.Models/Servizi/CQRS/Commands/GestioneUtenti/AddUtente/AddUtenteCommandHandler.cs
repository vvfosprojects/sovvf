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
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti.GestioneRuolo;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti.GetUtenti;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti.VerificaUtente;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Personale;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
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
        private readonly IGetDistaccamentoByCodiceSedeUC _getDistaccamentoByCodiceSede;
        private readonly IGetUtenteByCF _getUtenteByCF;
        private readonly IAddRuoli _addRuoli;
        private readonly IFindUserByUsername _checkOmonimia;

        public AddUtenteCommandHandler(IAddUtente addUtente, IGetPersonaleByCF personaleByCF,
            IGetAlberaturaUnitaOperative getAlberaturaUnitaOperative,
            IGetDistaccamentoByCodiceSedeUC getDistaccamentoByCodiceSede,
            IGetUtenteByCF getUtenteByCF,
            IAddRuoli addRuoli,
            IFindUserByUsername checkOmonimia)

        {
            _addUtente = addUtente;
            _personaleByCF = personaleByCF;
            _getAlberaturaUnitaOperative = getAlberaturaUnitaOperative;
            _getDistaccamentoByCodiceSede = getDistaccamentoByCodiceSede;
            _getUtenteByCF = getUtenteByCF;
            _addRuoli = addRuoli;
            _checkOmonimia = checkOmonimia;
        }

        /// <summary>
        ///   metodo della classe
        /// </summary>
        /// <param name="command">il command con i parametri di ingresso</param>
        public void Handle(AddUtenteCommand command)
        {
            var utenteSO = _getUtenteByCF.Get(command.CodFiscale);
            var personale = _personaleByCF.Get(command.CodFiscale).Result;
            var listaPin = new List<PinNodo>();
            var sediAlberate = _getAlberaturaUnitaOperative.ListaSediAlberata();
            var distaccamento = _getDistaccamentoByCodiceSede.Get(personale.sede.id).Result;

            foreach (var ruolo in command.Ruoli)
            {
                listaPin.Add(new PinNodo(ruolo.CodSede, ruolo.Ricorsivo));
                foreach (var figli in sediAlberate.Result.GetSottoAlbero(listaPin))
                {
                    if (figli.Codice.Equals(ruolo.CodSede))
                    {
                        ruolo.DescSede = figli.Nome;
                    }
                }
            }

            if (_checkOmonimia.FindUserByUs(personale.nome.Replace(" ", "").ToLower()) != null)
            {
                personale.nome = personale.nome.Replace(" ", "").ToLower() + "1";
            }
            //Test di refresh chain
            var utenteVVF = new Utente(command.CodFiscale, personale.nome.Trim().ToLower(), personale.cognome.Trim().ToLower())
            {
                Ruoli = command.Ruoli,
                Username = $"{personale.nome.Trim().ToLower()}.{personale.cognome.Trim().ToLower()}",
                Password = "test",
                Sede = new Sede($"{distaccamento.CodSede}", distaccamento.DescDistaccamento, distaccamento.Indirizzo, distaccamento.Coordinate)
            };

            if (utenteSO != null)
                _addRuoli.Add(command.CodFiscale, command.Ruoli);
            else
            {
                _addUtente.Add(utenteVVF);
            }
        }
    }
}
