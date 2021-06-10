using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.Models.Classi.Pos;
using SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GestionePOS.RicercaElencoPOS;
using SO115App.Models.Servizi.Infrastruttura.GestionePOS;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.Persistence.MongoDB.GestionePOS
{
    public class GetPOS : IGetPOS
    {
        private readonly DbContext _dbContext;

        public GetPOS(DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public List<PosDAO> Get(GetElencoPOSQuery filtri)
        {
            var text = filtri.Filters.Search?.ToLower() ?? "";

            var Tipologia = new TipologiaPos();
            if (filtri.Filters.idTipologia != 0)
            {
                Tipologia = new TipologiaPos()
                {
                    CodTipologia = filtri.Filters.idTipologia
                };

                if (filtri.Filters.idDettaglioTipologia != 0)
                {
                    Tipologia.CodTipologiaDettaglio.Add(filtri.Filters.idDettaglioTipologia);
                }
            }

            var lstPOS = _dbContext.DtoPosCollection.Find(c => c.CodSede.Equals(filtri.CodiceSede)
                && (c.DescrizionePos.ToLower().Contains(text)))
                //|| c.ListaTipologie.Contains(Tipologia)))
                .Project("{fDFile: 0}").ToList();

            var lstDes = new List<PosDAO>();
            foreach (BsonDocument pos in lstPOS)
                lstDes.Add(BsonSerializer.Deserialize<PosDAO>(pos));

            return lstDes;
        }

        public PosDAO GetPosById(string id)
        {
            return _dbContext.DtoPosCollection.Find(c => c.Id.Equals(id)).FirstOrDefault();
        }
    }
}
