//-----------------------------------------------------------------------
// <copyright file="ListaMezziInServizioQueryHandler.cs" company="CNVVF">
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
using CQRS.Queries;
using SO115App.API.Models.Classi.Organigramma;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.Mezzi;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.API.Models.Servizi.CQRS.Queries.GestioneMezziInServizio.ListaMezziInSerivizio
{
    public class ListaMezziInServizioQueryHandler : IQueryHandler<ListaMezziInServizioQuery, ListaMezziInServizioResult>
    {
        private readonly IGetListaMezzi _getListaMezzi;
        private readonly IGetUtenteById _getUtenteById;
        private readonly IGetAlberaturaUnitaOperative _getAlberaturaUnitaOperative;

        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        public ListaMezziInServizioQueryHandler(IGetListaMezzi getListaMezzi, IGetUtenteById getUtenteById,
            IGetAlberaturaUnitaOperative getAlberaturaUnitaOperative)
        {
            this._getListaMezzi = getListaMezzi;
            this._getUtenteById = getUtenteById;
            this._getAlberaturaUnitaOperative = getAlberaturaUnitaOperative;
        }

        /// <summary>
        ///   Metodo di esecuzione della query
        /// </summary>
        /// <param name="query">Il DTO di ingresso della query</param>
        /// <returns>Il DTO di uscita della query</returns>
        public ListaMezziInServizioResult Handle(ListaMezziInServizioQuery query)
        {
            var Utente = _getUtenteById.GetUtenteByCodice(query.IdOperatore);
            var listaSediUtenteAbilitate = Utente.Ruoli.Where(x => x.Descrizione.Equals(Costanti.GestoreRichieste)).ToHashSet();
            var listaSediAlberate = _getAlberaturaUnitaOperative.ListaSediAlberata();
            var pinNodi = new List<PinNodo>();

            /// <summary>
            ///Faccio gestire esclusivamente i Mezzi in Servizio delle Sedi nel quale l'operatore ha il ruolo di Gestore Richieste
            /// </summary>
            foreach (var sede in listaSediUtenteAbilitate)
            {
                pinNodi.Add(new PinNodo(sede.CodSede, true));
            }

            /// <summary>
            ///   Aggiungo alla Sede principale gli eventuali sotto Nodi
            /// </summary>
            foreach (var figlio in listaSediAlberate.GetSottoAlbero(pinNodi))
            {
                pinNodi.Add(new PinNodo(figlio.Codice, true));
            }

            var listaCodiciSediGestite = pinNodi.Select(x => x.Codice).ToArray();

            var listaMezzi = _getListaMezzi.Get(listaCodiciSediGestite);

            return new ListaMezziInServizioResult()
            {
                ListaMezzi = listaMezzi
            };
        }
    }
}
