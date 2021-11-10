using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.Models.Classi.Emergenza;
using SO115App.Models.Servizi.Infrastruttura.GestioneEmergenza;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Persistence.MongoDB.GestioneEmergenza
{
    public class SetCraTreeData : ISetCraTreeData
    {
        private readonly DbContext _dbContext;

        public SetCraTreeData(DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public void Set(CraTreeData data)
        {
            //Cancello il vecchio, qualora presente
            var filterDataDelete = Builders<CraTreeData>.Filter.Eq(s => s.ItemValue, data.ItemValue);
            _dbContext.CraTreeDataCollection.DeleteMany(filterDataDelete);

            //Inserisco il nuovo
            _dbContext.CraTreeDataCollection.InsertOne(data);
            
        }
    }
}
