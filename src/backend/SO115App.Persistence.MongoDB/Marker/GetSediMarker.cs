using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.API.Models.Classi.Geo;
using SO115App.API.Models.Classi.Marker;
using SO115App.Models.Classi.MongoDTO;
using SO115App.Models.Servizi.Infrastruttura.Marker;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Persistence.MongoDB.Marker
{
    public class GetSediMarker : IGetSediMarker
    {
        private readonly DbContext _context;

        public GetSediMarker(DbContext context)
        {
            this._context = context;
        }

        public List<SedeMarker> GetListaSediMarker(AreaMappa Filtro)
        {

            List<SedeMarker> listaSediMarker = new List<SedeMarker>();

            var listaSedi = _context.SediCollection.Find(Builders<ListaSedi>.Filter.Empty).ToList();

            foreach(var sede in listaSedi) 
            {
                SedeMarker sedeMarker = new SedeMarker();

                sedeMarker.Codice = sede.codSede_TC + "." + sede.codFiglio_TC;
                sedeMarker.Coordinate = new API.Models.Classi.Condivise.Coordinate(sede.latitudine, sede.longitudine);
                sedeMarker.Descrizione = sede.sede;
                sedeMarker.Provincia = sede.codProv;
                sedeMarker.Tipo = GetTipoSede(sede);

                listaSediMarker.Add(sedeMarker);
            }


            return listaSediMarker;
        }

        private string GetTipoSede(ListaSedi sede)
        {
            if (sede.sede.Contains("Comando"))
                return "Comando";
            else if (sede.sede.Contains("Distaccamento"))
                return "Distaccamento";
            else
                return "Direzione";

        }
    }
}
