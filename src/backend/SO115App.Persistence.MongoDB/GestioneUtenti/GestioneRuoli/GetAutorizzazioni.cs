//-----------------------------------------------------------------------
// <copyright file="GetAutorizzazioni.cs" company="CNVVF">
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
using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.API.Models.Classi.Autenticazione;
using SO115App.API.Models.Classi.Organigramma;
using SO115App.Models.Servizi.Infrastruttura.Autenticazione;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.Persistence.MongoDB.GestioneUtenti.GestioneRuoli
{
    public class GetAutorizzazioni : IGetAutorizzazioni
    {
        private readonly DbContext _dbContext;
        private readonly IGetAlberaturaUnitaOperative _getListaUO;

        public GetAutorizzazioni(DbContext dbContext, IGetAlberaturaUnitaOperative getListaUO)
        {
            _dbContext = dbContext;
            _getListaUO = getListaUO;
        }

        /// <summary>
        ///   metodo della classe che recupera i ruoli appartenenti ad un utente
        /// </summary>
        /// <param name="id">Id dell'utente su mongo</param>
        /// <returns>L'utente</returns>

        public bool GetAutorizzazioniUtente(List<Role> ruoli, string codSedeDaVerificare, string ruoloNecessario)
        {
            var listaSediAlberate = _getListaUO.ListaSediAlberata();
            var listaPin = new List<PinNodo>();
            foreach (var ruolo in ruoli.FindAll(x => x.Descrizione.Equals(ruoloNecessario)))
            {
                listaPin.Add(new PinNodo(ruolo.CodSede, ruolo.Ricorsivo));
            }
            foreach (var unita in listaSediAlberate.GetSottoAlbero(listaPin))
            {
                if (unita.Codice.Equals(codSedeDaVerificare))
                {
                    return true;
                }
            }
            return false;
        }
    }
}
