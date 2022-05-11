using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.GestioneDB;
using System;
using System.Collections.Generic;

namespace SO115App.Persistence.MongoDB.GestioneLog
{
    public class GetLog : IGetExternalLog
    {
        private readonly DbContext _dbContext;

        public GetLog(DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public List<ExternalApiLog> Get()
        {
            var dataMinima = DateTime.Now.AddDays(-2);

            return _dbContext.ExternalApiLog.Find(l => l.DataOraEsecuzione >= dataMinima).ToList();
        }
    }
}
