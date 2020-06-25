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
    public class GetDistaccamentiByCodiciSede : IGetListaDistaccamentiByPinListaSedi
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
            var listaSottoSedi = listaSedi.GetSottoAlbero(listaPin).Where(x => x.Codice.Length > 2);

            List<ListaSedi> DistaccamentiResult = new List<ListaSedi>();

            if (listaPin[0].Codice.Equals("CON"))
                DistaccamentiResult = _dbContext.SediCollection.Find(Builders<ListaSedi>.Filter.Empty).ToList();
            else
            {
                var filtroSede = Builders<ListaSedi>.Filter
                    .In(sede => sede.codProv, listaSottoSedi.Select(uo => uo.Codice.Split('.')[0]));

                var filtroCodice = Builders<ListaSedi>.Filter
                    .In(sede => sede.codFiglio_TC, listaSottoSedi.Select(uo => Convert.ToInt32(uo.Codice.Split('.')[1])));

                var filterAttive = Builders<ListaSedi>.Filter.Eq(x => x.attiva, 1);
                DistaccamentiResult = _dbContext.SediCollection.Find(filtroSede & filtroCodice & filterAttive).ToList();
            }

            return MapSediMongoSuDistaccamenti.Map(DistaccamentiResult);
        }
    }
}
