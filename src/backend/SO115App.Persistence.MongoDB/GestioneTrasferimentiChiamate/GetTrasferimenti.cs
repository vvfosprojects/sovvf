using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.GestioneTrasferimentiChiamate;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.Persistence.MongoDB.GestioneTrasferimentiChiamate
{
    public class GetTrasferimenti : IGetTrasferimenti
    {
        private readonly DbContext _dbContext;
        public GetTrasferimenti(DbContext dbContext) => _dbContext = dbContext;

        public List<TrasferimentoChiamata> GetAll(string[] CodiciSedi)
        {
            return _dbContext.TrasferimentiChiamateCollection
                .Find(c => c.CodSedeA.Any(x => CodiciSedi.Contains(x)) || CodiciSedi.Contains(c.CodSedeDa))
                .ToList();
        }
    }
}
