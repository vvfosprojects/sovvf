using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.Models.Classi.ServiziEsterni.NUE;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Persistence.MongoDB.GestioneDB
{
    public class DbWatchForChange : IWatchChangeSchedeNue
    {
        private readonly DbContext _dbContext;

        public DbWatchForChange(DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public void StartCollectionWatch()
        {
            // We are just watching insert operation
            var pipeline = new EmptyPipelineDefinition<ChangeStreamDocument<SchedaContattoWSNue>>().Match("{ operationType: { $eq: 'insert' } }");
            // start the watch on the collection
            using (var printQueueStream = _dbContext.SchedeNueCollection.Watch(pipeline).ToEnumerable().GetEnumerator())
            {
                // loop is required so that we are always connected and looking for next document
                while (true)
                {
                    try
                    {
                    }
                    catch (Exception ex)
                    {
                    }
                }
            }
        }
    }
}
