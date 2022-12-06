using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.API.Models.Classi.Organigramma;
using SO115App.Models.Classi.Pos;
using SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GestionePOS.RicercaElencoPOS;
using SO115App.Models.Servizi.Infrastruttura.GestionePOS;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.Persistence.MongoDB.GestionePOS
{
    public class GetPOS : IGetPOS
    {
        private readonly DbContext _dbContext;
        private readonly IGetAlberaturaUnitaOperative _getAlberaturaUnitaOperative;

        public GetPOS(DbContext dbContext, IGetAlberaturaUnitaOperative getAlberaturaUnitaOperative)
        {
            _dbContext = dbContext;
            _getAlberaturaUnitaOperative = getAlberaturaUnitaOperative;
        }

        public List<PosDAO> Get(GetElencoPOSQuery filtri)
        {
            var listaSediAlberate = _getAlberaturaUnitaOperative.ListaSediAlberata();

            var pinNodi = new List<PinNodo>();
            pinNodi.Add(new PinNodo(filtri.CodiceSede, true));

            //foreach (var figlio in listaSediAlberate.Result.GetSottoAlbero(pinNodi))
            //    pinNodi.Add(new PinNodo(figlio.Codice, true));

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
                    Tipologia.CodTipologiaDettaglio = new List<int>();
                    Tipologia.CodTipologiaDettaglio.Add(filtri.Filters.idDettaglioTipologia);
                }
            }

            //Per la ricorsività cerco se il codice sede ha un padre e. Se sono su Roma cerco il codice della Direzione Lazio per poter vedere le POS create dalla direzione
            var codiceSedePadre = _getAlberaturaUnitaOperative.GetCodiceSedePadre(filtri.CodiceSede);

            var listaCodici = pinNodi.Select(x => x.Codice).ToList();

            if (codiceSedePadre.Trim().Length > 0)
                listaCodici.Add(codiceSedePadre);

            var filtroSediCompetenti = Builders<PosDAO>.Filter
                .In(p => p.CodSede, listaCodici.Select(uo => uo));

            var lstPOS = _dbContext.DtoPosCollection.Find(c => listaCodici.Contains(c.CodSede)
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

        public List<PosDAO> GetPosByCodTipologiaCodDettaglio(GetElencoPOSQuery filtri)
        {
            var Tipologia = new TipologiaPos();
            if (filtri.Filters.idTipologia != 0)
            {
                Tipologia = new TipologiaPos()
                {
                    CodTipologia = filtri.Filters.idTipologia
                };

                if (filtri.Filters.idDettaglioTipologia != 0)
                {
                    Tipologia.CodTipologiaDettaglio = new List<int>();
                    Tipologia.CodTipologiaDettaglio.Add(filtri.Filters.idDettaglioTipologia);
                }
            }

            var lstPOS = _dbContext.DtoPosCollection.Find(c => c.CodSede.Equals(filtri.CodiceSede)
                && (c.ListaTipologie.Contains(Tipologia)))
                .Project("{fDFile: 0}").ToList();

            var lstDes = new List<PosDAO>();
            foreach (BsonDocument pos in lstPOS)
                lstDes.Add(BsonSerializer.Deserialize<PosDAO>(pos));

            return lstDes;
        }
    }
}
