using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Classi.MongoDTO
{
    [BsonIgnoreExtraElements]
    public class ListaSedi
    { 
        public string Id { get; set; }

        [BsonElement("IDSEDE")]
        [BsonRepresentation(BsonType.Int32, AllowTruncation = true)]
        public int idsede { get; set; }

        [BsonElement("CODCOMUNE")]
        public double codComune { get; set; }

        [BsonElement("DESCCOMUNE")]
        public string descComune { get; set; }

        [BsonElement("CODPROV")]
        public string codProv { get; set; }

        [BsonElement("SEDE")]
        public string sede { get; set; }

        [BsonElement("IDSEDEPADRE")]
        public int idSedePadre { get; set; }

        [BsonElement("LATITUDINE")]
        public double latitudine { get; set; }

        [BsonElement("LONGITUDINE")]
        public double longitudine { get; set; }

        [BsonElement("CODSEDE_TC")]
        public string codSede_TC { get; set; }

        [BsonElement("CODFIGLIO_TC")]
        public int codFiglio_TC { get; set; }

        [BsonElement("CODPADRE_TC")]
        public string codPadre_TC { get; set; }

        [BsonElement("LOC")]
        public double[] loc { get; set; }
   
    }
}
