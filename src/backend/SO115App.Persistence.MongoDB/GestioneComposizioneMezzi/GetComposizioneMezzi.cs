using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.API.Models.Classi.Composizione;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.Persistence.MongoDB.GestioneComposizioneMezzi
{
    public class GetComposizioneMezzi : IGetComposizioneMezziDB
    {
        DbContext _dbContext;
        public GetComposizioneMezzi(DbContext dbContext) => _dbContext = dbContext;

        public List<ComposizioneMezzi> GetByCodiciSede(string[] codiciSede)
        {
            if (codiciSede == null || codiciSede.Length == 0)
            {
                var result = _dbContext.ComposizioneMezziCollection.Find(Builders<ComposizioneMezzi>.Filter.Empty).ToList();

                return result;
            }
            else
            {
                var filter = codiciSede.Select(c => c.Split('.')[0]).Distinct();

                var result = _dbContext.ComposizioneMezziCollection.Find(Builders<ComposizioneMezzi>.Filter.In(m => m.Mezzo.Appartenenza, filter)).ToList();

                return result;
            }
        }
    }
}
