﻿using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.IdGenerators;
using MongoDB.Bson.Serialization.Serializers;
using SO115App.Models.Classi.Emergenza;

namespace SO115App.Persistence.MongoDB.Mappings
{
    public class TipologieEmergenzaMap
    {
        public static void Map()
        {
            BsonClassMap.RegisterClassMap<TipologiaEmergenza>(cm =>
            {
                cm.AutoMap();
                cm.MapIdMember(c => c.Id)
                    .SetIdGenerator(StringObjectIdGenerator.Instance)
                    .SetSerializer(new StringSerializer(BsonType.ObjectId));
            });
        }
    }
}
