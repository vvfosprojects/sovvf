using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.API.Models.Classi.Organigramma;
using SO115App.Models.Servizi.Infrastruttura.GestioneSedi;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Persistence.MongoDB.GestioneSedi
{
    public class GetListaSediAlberata : IGetAllSediAlberate
    {
        private readonly DbContext _dbContext;

        public GetListaSediAlberata(DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public UnitaOperativa GetSediAlberate()
        {
            return _dbContext.ListaSediCollection.Find(Builders<UnitaOperativa>.Filter.Empty).FirstOrDefault();
        }
    }
}
