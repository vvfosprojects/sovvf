using MongoDB.Bson.Serialization;
using SO115App.API.Models.Classi.Soccorso;

namespace SO115App.Persistence.MongoDB.Mappings
{
    internal static class EventiMap
    {
        public static void Map()
        {
            BsonClassMap.RegisterClassMap<RichiestaAssistenza>(cm =>
            {
                cm.AutoMap();
                cm.MapField("_eventi").SetElementName("listaEventi");
            });
        }
    }
}
