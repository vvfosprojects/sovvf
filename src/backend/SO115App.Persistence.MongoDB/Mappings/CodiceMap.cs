using MongoDB.Bson.Serialization;
using SO115App.API.Models.Classi.Soccorso.Eventi.Segnalazioni;

namespace SO115App.Persistence.MongoDB.Mappings
{
    internal static class CodiceMap
    {
        public static void Map()
        {
            BsonClassMap.RegisterClassMap<Segnalazione>(cm =>
            {
                cm.AutoMap();
                cm.MapProperty("Codice");
            });
        }
    }
}
