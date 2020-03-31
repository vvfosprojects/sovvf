using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.API.Models.Classi.Organigramma;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Classi.MongoDTO;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using SO115App.Persistence.MongoDB.GestioneSedi.Utility;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace SO115App.Persistence.MongoDB.GestioneSedi
{
    public class GetDistaccamentiByCodiciSede: IGetListaDistaccamentiByPinListaSedi
    {
        private readonly DbContext _dbContext;
        private readonly IGetAlberaturaUnitaOperative _getSediAlberate;

        public GetDistaccamentiByCodiciSede(DbContext dbContext, IGetAlberaturaUnitaOperative getSediAlberate)
        {
            _dbContext = dbContext;
            _getSediAlberate = getSediAlberate;
        }

        public List<Distaccamento> GetListaDistaccamenti(List<PinNodo> listaPin)
        {
            var listaSedi = _getSediAlberate.ListaSediAlberata();
            var listaSottoSedi = listaSedi.GetSottoAlbero(listaPin);

            var filtroSedi = Builders<ListaSedi>.Filter
            .In(sede => sede.codSede_TC + "." + sede.codFiglio_TC.ToString(), listaSottoSedi.Select(uo => uo.Codice));

            List<ListaSedi> DistaccamentiResult = _dbContext.SediCollection.Find(filtroSedi).ToList();

            return MapSediMongoSuDistaccamenti.Map(DistaccamentiResult);

        }
    }
}
