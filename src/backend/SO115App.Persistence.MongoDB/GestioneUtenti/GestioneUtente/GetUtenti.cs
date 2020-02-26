//-----------------------------------------------------------------------
// <copyright file="GetUtenti.cs" company="CNVVF">
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
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Personale;
using System;
using System.Collections.Generic;

namespace SO115App.Persistence.MongoDB.GestioneUtenti.GestioneUtente
{
    /// <summary>
    ///   classe che recupera tutti gli utenti da MongoDB
    /// </summary>
    public class GetUtenti : IGetUtenti
    {
        private readonly DbContext _dbContext;

        public GetUtenti(DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        /// <summary>
        ///   metodo che cerca tutti gli utenti dalla collection
        /// </summary>
        /// <param name="codiceSede"></param>
        /// <param name="cercaNoC">
        ///   se valorizzato cerca se la stringa è contenuta nel nome o nel cognome
        /// </param>
        /// <returns>Una lista di Utenti</returns>
        public List<Utente> Get(string codiceSede, string cercaNoC = null)
        {
            return cercaNoC == null
                ? _dbContext.UtenteCollection.Find(Builders<Utente>.Filter.Eq(x => x.Sede.Codice, codiceSede)).ToList()
                : _dbContext.UtenteCollection.Aggregate().Match(m => m.Nome.Contains(cercaNoC.ToUpper()) || m.Cognome.Contains(cercaNoC.ToUpper())).ToList().FindAll(x => x.Sede.Codice.Equals(codiceSede));
        }
    }
}
