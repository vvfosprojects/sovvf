using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.IdGenerators;
using MongoDB.Bson.Serialization.Serializers;
using SO115App.API.Models.Classi.Autenticazione;

namespace SO115App.Persistence.MongoDB.Mappings
{
    internal static class UtenteMap
    {
        public static void Map()
        {
            BsonClassMap.RegisterClassMap<Utente>(cm =>
            {
                cm.AutoMap();
                cm.MapIdMember(c => c.Id)
                    .SetIdGenerator(StringObjectIdGenerator.Instance)
                    .SetSerializer(new StringSerializer(BsonType.ObjectId));
            });
        }
    }
}
