﻿using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.IdGenerators;
using MongoDB.Bson.Serialization.Serializers;
using SO115App.API.Models.Classi.Soccorso.Eventi.Partenze;

namespace SO115App.Persistence.MongoDB.Mappings
{
    public class ComposizioniPartenzeMap
    {
        public static void Map()
        {
            BsonClassMap.RegisterClassMap<ComposizionePartenze>(cm =>
            {
                cm.AutoMap();
                cm.MapIdMember(c => c.Id)
                    .SetIdGenerator(StringObjectIdGenerator.Instance)
                    .SetSerializer(new StringSerializer(BsonType.ObjectId));
            });
        }
    }
}
