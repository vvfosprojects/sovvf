using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.Models.Classi.Documentale;
using SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GestioneDocumentale.RicercaElencoDoc;
using SO115App.Models.Servizi.Infrastruttura.GestioneDocumentale;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.Persistence.MongoDB.GestioneDocumentale
{
    public class GetDoc : IGetDoc
    {
        private readonly DbContext _dbContext;

        public GetDoc(DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public List<DaoDocumentale> Get(GetElencoDocQuery filtri)
        {
            var text = filtri.Filters.Search?.ToLower() ?? "";

            var lstDoc = _dbContext.DocumentaleCollection.Find(c => c.CodSede.Equals(filtri.CodiceSede)).Project("{fDFile: 0}").ToList();

            var lstDes = new List<DaoDocumentale>();
            foreach (BsonDocument pos in lstDoc)
                lstDes.Add(BsonSerializer.Deserialize<DaoDocumentale>(pos));

            if (filtri.Filters.DescCategorie?.Count() > 0)
                lstDes = lstDes.Where(d => filtri.Filters.DescCategorie.Any(cat => cat.Contains(d.DescrizioneCategoria))).ToList();

            if (filtri.Filters.Search != null)
                lstDes = lstDes.Where(d => d.DescrizioneDocumento.ToLower().Contains(text)).ToList();

            return lstDes;
        }

        public DaoDocumentale GetDocById(string id)
        {
            return _dbContext.DocumentaleCollection.Find(c => c.Id.Equals(id)).FirstOrDefault();
        }

        public List<DaoDocumentale> GetDocByCodCategoria(GetElencoDocQuery filtri)
        {
            var lstDoc = _dbContext.DocumentaleCollection.Find(c => c.CodSede.Equals(filtri.CodiceSede)
                && (filtri.Filters.DescCategorie.Any(cat => cat.Contains(c.DescrizioneCategoria))))
                .Project("{fDFile: 0}").ToList();

            var lstDes = new List<DaoDocumentale>();
            foreach (BsonDocument pos in lstDoc)
                lstDes.Add(BsonSerializer.Deserialize<DaoDocumentale>(pos));

            return lstDes;
        }
    }
}
