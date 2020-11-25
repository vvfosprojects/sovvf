using Persistence.MongoDB;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.GestioneLog;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Persistence.MongoDB.GestioneLog
{
    public class WriteLog : IWriteLog
    {
        private readonly DbContext _dbContext;

        public WriteLog(DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public void Save(LogException exception)
        {
            _dbContext.LogExceptionCollection.InsertOne(exception);
        }
    }
}
