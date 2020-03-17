using MongoDB.Driver;
using MongoDB.Driver.GeoJsonObjectModel;
using Persistence.MongoDB;
using SO115App.API.Models.Classi.Condivise;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Classi.MongoDTO;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Competenze;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Persistence.MongoDB.GestioneSedi
{
    public class GetcompetenzeByCoordinateIntervento: IGetCompetenzeByCoordinateIntervento
    {
        private readonly DbContext _dbContext;

        public GetcompetenzeByCoordinateIntervento(DbContext dbcontext)
        {
            this._dbContext = dbcontext;
        }

        public CompetenzeRichiesta GetCompetenzeByCoordinateIntervento(Coordinate coordinate)
        {
            double maxDistanceInKm = 20;
            var point = GeoJson.Point(GeoJson.Geographic(coordinate.Longitudine, coordinate.Latitudine));
            var filter = Builders<ListaSedi>.Filter.Near(x => x.loc, point, maxDistanceInKm * 1000);

            List<ListaSedi> CompetenzeVicine = _dbContext.SediCollection.Find(filter).ToList();

            CompetenzeRichiesta competenze = new CompetenzeRichiesta()
            {
                CodDistaccamento = CompetenzeVicine[0].codFiglio_TC,
                CodDistaccamento2 = CompetenzeVicine[1].codFiglio_TC,
                CodDistaccamento3 = CompetenzeVicine[2].codFiglio_TC,
            };

            return competenze;
        }

    }
}
