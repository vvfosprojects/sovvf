using MongoDB.Driver;
using MongoDB.Driver.GeoJsonObjectModel;
using Persistence.MongoDB;
using SO115App.API.Models.Classi.Condivise;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Classi.MongoDTO;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Competenze;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace SO115App.Persistence.MongoDB.GestioneSedi
{
    public class GetcompetenzeByCoordinateIntervento : IGetCompetenzeByCoordinateIntervento
    {
        private readonly DbContext _dbContext;

        public GetcompetenzeByCoordinateIntervento(DbContext dbcontext)
        {
            this._dbContext = dbcontext;
        }

        public string[] GetCompetenzeByCoordinateIntervento(Coordinate coordinate)
        {
            try
            {
                double maxDistanceInKm = 20;
                var point = GeoJson.Point(GeoJson.Geographic(coordinate.Longitudine, coordinate.Latitudine));
                var filter = Builders<ListaSedi>.Filter.Near(x => x.loc, point, maxDistanceInKm * 1000);
                var filterAttive = Builders<ListaSedi>.Filter.Eq(x => x.attiva, 1);
                var filterSpeciali = Builders<ListaSedi>.Filter.Eq(x => x.specialista, 0);

                List<ListaSedi> CompetenzeVicine = _dbContext.SediCollection.Find(filter & filterAttive & filterSpeciali).ToList();

                CompetenzeVicine = CompetenzeVicine.FindAll(x => !x.sede.Contains("Direzione"));

                if (CompetenzeVicine.Count > 3)
                    CompetenzeVicine = CompetenzeVicine.Take(3).ToList();

                string[] CodUOCompetenzaAppo = new string[CompetenzeVicine.Count + 1];

                int contatore = 0;
                if (CompetenzeVicine.Count > 0)
                {
                    CodUOCompetenzaAppo[0] = CompetenzeVicine[0].codProv + "." + CompetenzeVicine[0].codFiglio_TC;

                    if (CompetenzeVicine.Count > 1)
                    {
                        CodUOCompetenzaAppo[1] = CompetenzeVicine[1].codProv + "." + CompetenzeVicine[1].codFiglio_TC;
                        contatore = contatore + 1;
                    }
                    if (CompetenzeVicine.Count > 2)
                    {
                        CodUOCompetenzaAppo[2] = CompetenzeVicine[2].codProv + "." + CompetenzeVicine[2].codFiglio_TC;
                        contatore = contatore + 1;
                    }
                    CodUOCompetenzaAppo[contatore + 1] = CompetenzeVicine[0].codProv + ".1000";
                }

                return CodUOCompetenzaAppo;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
    }
}
