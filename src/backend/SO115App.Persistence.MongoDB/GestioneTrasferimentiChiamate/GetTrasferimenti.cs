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

        public List<TrasferimentoChiamata> GetAll(string[] CodiciSedi, string textSearch)
        {
            var text = textSearch?.ToLower() ?? "";

            return _dbContext.TrasferimentiChiamateCollection
                .Find(c => c.CodRichiesta.ToLower().Contains(text) && (CodiciSedi.Contains(c.CodSedeA) || CodiciSedi.Contains(c.CodSedeDa)))
                .ToList();
        }

        public int Count(string CodiceSede)
        {
            return (int)_dbContext.TrasferimentiChiamateCollection
                .Find(c => CodiceSede.Equals(c.CodSedeA) || CodiceSede.Equals(c.CodSedeDa))
                .Count();
        }
    }
}