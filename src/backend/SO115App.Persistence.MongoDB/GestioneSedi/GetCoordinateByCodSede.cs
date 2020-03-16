using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.API.Models.Classi.Condivise;
using SO115App.Models.Classi.MongoDTO;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Persistence.MongoDB.GestioneSedi
{
    public class GetCoordinateByCodSede: IGetCoordinateByCodSede
    {
        private readonly DbContext _dbContext;

        public GetCoordinateByCodSede(DbContext dbContext)
        {
            this._dbContext = dbContext;
        }

        /// <summary>
        ///   metodo get che restituisce le coordinate di una sede
        /// </summary>
        /// <param name="codiceSede">il codice della sede</param>
        /// <returns>L'utente cercato</returns>
        public Coordinate Get(string codiceSede)
        {
            var builder = Builders<ListaSedi>.Filter;
            var filter = builder.Eq(x => x.codSede_TC, codiceSede.Split('.')[0]) & builder.Eq(x => x.codFiglio_TC, Convert.ToDouble(codiceSede.Split('.')[1]));

            var CodSede = codiceSede.Split('.')[0];
            var CodFiglio = Convert.ToInt32(codiceSede.Split('.')[1]);

            List<ListaSedi> ListaSedi = _dbContext.SediCollection.Find(Builders<ListaSedi>.Filter.Empty).ToList();

            var sede = ListaSedi.Find(x => x.codFiglio_TC.Equals(CodFiglio) && x.codSede_TC.Equals(CodSede));

            Coordinate coordinate = new Coordinate(sede.latitudine, sede.longitudine);

            return coordinate;
        }
    }
}
