//-----------------------------------------------------------------------
// <copyright file="SetStatoSquadra.cs" company="CNVVF">
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
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.GestioneStatoOperativoSquadra;

namespace SO115App.Persistence.MongoDB.GestioneStatoSquadra
{
    /// <summary>
    ///   classe che implementa il servizio ISetStatoSquadra e va a scrivere lo stesso su MongoDB
    /// </summary>
    public class SetStatoSquadra : ISetStatoSquadra
    {
        private readonly DbContext _dbContext;

        public SetStatoSquadra(DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        /// <summary>
        ///   metodo che va a scrivere su MongoDB
        /// </summary>
        /// <param name="idSquadra">l'identificativo della squadra</param>
        /// <param name="idRichiesta">l'id della richiesta</param>
        /// <param name="statoSquadra">lo stato della squadra</param>
        public void SetStato(string idSquadra, string idRichiesta, string statoSquadra, string codiceSede)
        {
            var statoOperativoSquadra = new StatoOperativoSquadra
            {
                IdRichiesta = idRichiesta,
                IdSquadra = idSquadra,
                StatoSquadra = statoSquadra,
                CodiceSede = codiceSede
            };

            if (statoOperativoSquadra.StatoSquadra.Equals(Costanti.MezzoInSede) || statoOperativoSquadra.StatoSquadra.Equals(Costanti.MezzoRientrato))
            {
                _dbContext.StatoSquadraCollection.DeleteOne(Builders<StatoOperativoSquadra>.Filter.Eq(x => x.IdSquadra, idSquadra));
            }
            else
            {
                var findAndReplaceOptions = new FindOneAndReplaceOptions<StatoOperativoSquadra> { IsUpsert = true };
                _dbContext.StatoSquadraCollection.FindOneAndReplace(Builders<StatoOperativoSquadra>.Filter.Eq(x => x.IdSquadra, idSquadra), statoOperativoSquadra, findAndReplaceOptions);
            }
        }
    }
}
