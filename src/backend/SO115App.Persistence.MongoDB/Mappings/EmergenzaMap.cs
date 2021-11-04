using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.IdGenerators;
using MongoDB.Bson.Serialization.Serializers;
using SO115App.Models.Classi.Emergenza;

namespace SO115App.Persistence.MongoDB.Mappings
{
    public class EmergenzaMap
    {
        public static void Map()
        {
            BsonClassMap.RegisterClassMap<Emergenza>(cm =>
            {
                cm.AutoMap();
                cm.MapField("_eventi").SetElementName("listaEventi");
                cm.MapIdMember(c => c.Id)
                    .SetIdGenerator(StringObjectIdGenerator.Instance)
                    .SetSerializer(new StringSerializer(BsonType.ObjectId));
            });
        }
    }
}
