using SO115App.Models.Classi.Condivise;
using SO115App.Models.Classi.MongoDTO;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Persistence.MongoDB.GestioneSedi.Utility
{
    public class MapSediMongoSuDistaccamenti
    {
        public static List<Distaccamento> Map(List<ListaSedi> listaSedi) 
        {
            List<Distaccamento> listaDistaccamenti = new List<Distaccamento>();

            foreach(var sede in listaSedi) 
            {
                Distaccamento distaccamento = new Distaccamento()
                {
                    Id = sede.codSede_TC + "." + sede.codFiglio_TC.ToString(),
                    CodDistaccamento = sede.codFiglio_TC,
                    CodSede = sede.codSede_TC,
                    Coordinate = new API.Models.Classi.Condivise.Coordinate(sede.latitudine, sede.longitudine),
                    DescDistaccamento = sede.sede              
                };

                listaDistaccamenti.Add(distaccamento);
            }
            return listaDistaccamenti;
        }
    }
}
