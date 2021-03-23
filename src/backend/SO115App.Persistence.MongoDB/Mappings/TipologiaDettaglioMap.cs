using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.IdGenerators;
using MongoDB.Bson.Serialization.Serializers;
using SO115App.Models.Classi.Condivise;

namespace SO115App.Persistence.MongoDB.Mappings
{
    internal static class TipologiaDettaglioMap
    {
        public static void Map()
        {
            BsonClassMap.RegisterClassMap<TipologiaDettaglio>(cm =>
            {
                cm.AutoMap();
                cm.MapIdMember(c => c.Id)
                    .SetIdGenerator(StringObjectIdGenerator.Instance)
                    .SetSerializer(new StringSerializer(BsonType.ObjectId));
            });
        }
    }
}
