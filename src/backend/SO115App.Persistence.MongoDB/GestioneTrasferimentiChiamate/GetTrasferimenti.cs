using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.GestioneTrasferimentiChiamate;
using System.Collections.Generic;

namespace SO115App.Persistence.MongoDB.GestioneTrasferimentiChiamate
{
    public class GetTrasferimenti : IGetTrasferimenti
    {
        private readonly DbContext _dbContext;
        public GetTrasferimenti(DbContext dbContext) => _dbContext = dbContext;

        public List<TrasferimentoChiamata> GetAll(string CodiceSede)
        {
            return _dbContext.TrasferimentiChiamateCollection.Find(c => c.CodSedeA == CodiceSede || c.CodSedeDa == CodiceSede).ToList();
        }
    }
}
