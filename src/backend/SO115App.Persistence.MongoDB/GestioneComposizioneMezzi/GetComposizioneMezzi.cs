using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.API.Models.Classi.Composizione;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Persistence.MongoDB.GestioneComposizioneMezzi
{
    public class GetComposizioneMezzi : IGetComposizioneMezziDB
    {
        DbContext _dbContext;
        public GetComposizioneMezzi(DbContext dbContext) => _dbContext = dbContext;

        public List<ComposizioneMezzi> Get()
        {
            var result = _dbContext.ComposizioneMezziCollection.Find(Builders<ComposizioneMezzi>.Filter.Empty).ToList();

            return result;
        }
    }
}
