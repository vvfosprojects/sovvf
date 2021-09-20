using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.Models.Classi.Documentale;
using SO115App.Models.Classi.Pos;
using SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GestioneDocumentale.RicercaElencoDoc;
using SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GestionePOS.RicercaElencoPOS;
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

            var lstDoc = _dbContext.DocumentaleCollection.Find(c => c.CodSede.Equals(filtri.CodiceSede)
                && (c.DescrizioneDocumento.ToLower().Contains(text)))
                .Project("{fDFile: 0}").ToList();

            var lstDes = new List<DaoDocumentale>();
            foreach (BsonDocument pos in lstDoc)
                lstDes.Add(BsonSerializer.Deserialize<DaoDocumentale>(pos));

            return lstDes;
        }

        public DaoDocumentale GetDocById(string id)
        {
            return _dbContext.DocumentaleCollection.Find(c => c.Id.Equals(id)).FirstOrDefault();
        }

        public List<DaoDocumentale> GetDocByCodCategoria(GetElencoDocQuery filtri)
        {
            var lstDoc = _dbContext.DocumentaleCollection.Find(c => c.CodSede.Equals(filtri.CodiceSede)
                && (c.DescrizioneCategoria.Contains(filtri.Filters.DescCategoria)))
                .Project("{fDFile: 0}").ToList();

            var lstDes = new List<DaoDocumentale>();
            foreach (BsonDocument pos in lstDoc)
                lstDes.Add(BsonSerializer.Deserialize<DaoDocumentale>(pos));

            return lstDes;
        }
    }
}
