//-----------------------------------------------------------------------
// <copyright file="DeleteRuolo.cs" company="CNVVF">
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
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti.GestioneRuolo;

namespace SO115App.Persistence.MongoDB.GestioneUtenti.GestioneRuoli
{
    public class DeleteRuolo : IDeleteRuolo
    {
        private readonly DbContext _dbcontext;

        public DeleteRuolo(DbContext dbcontext)
        {
            _dbcontext = dbcontext;
        }

        public void Delete(string codiceFiscale, Role ruolo)
        {
            var filter = Builders<Utente>.Filter.Eq(x => x.CodiceFiscale, codiceFiscale);
            _dbcontext.UtenteCollection.UpdateOne(filter, Builders<Utente>.Update.Pull(x => x.Ruoli, ruolo));
        }
    }
}
