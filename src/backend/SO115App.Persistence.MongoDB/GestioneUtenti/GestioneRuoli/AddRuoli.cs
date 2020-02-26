//-----------------------------------------------------------------------
// <copyright file="AddRuoli.cs" company="CNVVF">
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
using System.Collections.Generic;

namespace SO115App.Persistence.MongoDB.GestioneUtenti.GestioneRuoli
{
    public class AddRuoli : IAddRuoli
    {
        private readonly DbContext dbContext;

        public AddRuoli(DbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public void Add(string codFiscale, List<Role> ruoli)
        {
            foreach (var ruolo in ruoli)
            {
                dbContext.UtenteCollection.UpdateOne(Builders<Utente>.Filter.Eq(x => x.CodiceFiscale, codFiscale), Builders<Utente>.Update.AddToSet("ruoli", ruolo));
            }
            
        }
    }
}
