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

        public List<ComposizioneMezzi> GetByCodiceMezzo(string codiceMezzo)
        {
            throw new System.NotImplementedException();
        }

        public List<ComposizioneMezzi> GetByCodiciMezzo(string[] codiciMezzo = null)
        {
            if (codiciMezzo == null || codiciMezzo.Length == 0)
            {
                var result = _dbContext.ComposizioneMezziCollection.Find(Builders<ComposizioneMezzi>.Filter.Empty).ToList();

                return result;
            }
            else
            {
                var result = _dbContext.ComposizioneMezziCollection.Find(Builders<ComposizioneMezzi>.Filter.In(m => m.Mezzo.Codice, codiciMezzo)).ToList();

                return result;
            }
        }

        public List<ComposizioneMezzi> GetByCodiciSede(string[] codiciSede)
        {
            if (codiciSede == null || codiciSede.Length == 0)
            {
                var result = _dbContext.ComposizioneMezziCollection.Find(Builders<ComposizioneMezzi>.Filter.Empty).ToList();

                return result;
            }
            else
            {
                var result = _dbContext.ComposizioneMezziCollection.Find(Builders<ComposizioneMezzi>.Filter.In(m => m.Mezzo.Appartenenza, codiciSede)).ToList();

                return result;
            }
        }
    }
}
