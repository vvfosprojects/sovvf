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
    public class GetCoordinateByCodSede : IGetCoordinateByCodSede
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
            var coordinate = new Coordinate(41.89996, 12.49104);

            if (codiceSede.Length > 2)
            {
                var builder = Builders<ListaSedi>.Filter;
                var filter = builder.Eq(x => x.codProv, codiceSede.Split('.')[0]) & builder.Eq(x => x.codFiglio_TC, Convert.ToDouble(codiceSede.Split('.')[1]));

                var CodSede = codiceSede.Split('.')[0];
                var CodFiglio = Convert.ToInt32(codiceSede.Split('.')[1]);
                var filterAttive = Builders<ListaSedi>.Filter.Eq(x => x.attiva, 1);

                List<ListaSedi> listaSedi = _dbContext.SediCollection.Find(filterAttive).ToList();

                var sede = listaSedi.Find(x => x.codFiglio_TC.Equals(CodFiglio) && x.codProv.Equals(CodSede));

                if (sede != null)
                    coordinate = new Coordinate(sede.latitudine, sede.longitudine);
                else
                {
                    listaSedi = _dbContext.SediCollection.Find(x => x.codProv.Equals(CodSede) && x.codFiglio_TC.Equals("1000")).ToList();
                    sede = listaSedi.Find(x => x.codFiglio_TC.Equals(1000) && x.codProv.Equals(CodSede));
                    coordinate = new Coordinate(sede.latitudine, sede.longitudine);
                }
            }
            else
            {
                var builder = Builders<ListaSedi>.Filter;

                //var CodFiglio = Convert.ToInt32(codiceSede);
                //var filterAttive = Builders<ListaSedi>.Filter.Eq(x => x.attiva, 1);

                ListaSedi sede = _dbContext.SediCollection.Find(x => x.codSede_TC.Equals(codiceSede) && x.attiva.Equals(1)).FirstOrDefault();

                //var sede = listaSedi.Find(x => x.sede.Equals(codiceSede));

                if (sede != null)
                {
                    coordinate = new Coordinate(sede.latitudine, sede.longitudine);
                }
            }

            return coordinate;
        }
    }
}
