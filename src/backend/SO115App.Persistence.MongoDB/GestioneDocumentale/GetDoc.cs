using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.API.Models.Classi.Organigramma;
using SO115App.Models.Classi.Documentale;
using SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GestioneDocumentale.RicercaElencoDoc;
using SO115App.Models.Servizi.Infrastruttura.GestioneDocumentale;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.Persistence.MongoDB.GestioneDocumentale
{
    public class GetDoc : IGetDoc
    {
        private readonly DbContext _dbContext;
        private readonly IGetAlberaturaUnitaOperative _getAlberaturaUnitaOperative;

        public GetDoc(DbContext dbContext, IGetAlberaturaUnitaOperative getAlberaturaUnitaOperative)
        {
            _dbContext = dbContext;
            _getAlberaturaUnitaOperative = getAlberaturaUnitaOperative;
        }

        public List<DaoDocumentale> Get(GetElencoDocQuery filtri)
        {
            var listaSediAlberate = _getAlberaturaUnitaOperative.ListaSediAlberata();
            var pinNodi = new List<PinNodo>();
            pinNodi.Add(new PinNodo(filtri.CodiceSede, true));

            foreach (var figlio in listaSediAlberate.Result.GetSottoAlbero(pinNodi))
                pinNodi.Add(new PinNodo(figlio.Codice, true));

            var text = filtri.Filters.Search?.ToLower() ?? "";

            var arrayCodiciSede = pinNodi.Select(n => n.Codice).ToArray();

            var lstDoc = _dbContext.DocumentaleCollection.Find(c => c.Id != null).Project("{fDFile: 0}").ToList();

            var lstDes = new List<DaoDocumentale>();
            foreach (BsonDocument pos in lstDoc)
                lstDes.Add(BsonSerializer.Deserialize<DaoDocumentale>(pos));

            lstDes = lstDes.Where(c => arrayCodiciSede.Any(s => s.Contains(c.CodSede))).ToList();

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
