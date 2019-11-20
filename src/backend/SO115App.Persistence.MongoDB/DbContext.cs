using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Conventions;
using MongoDB.Bson.Serialization.IdGenerators;
using MongoDB.Bson.Serialization.Serializers;
using MongoDB.Driver;
using SO115App.API.Models.Classi.Persistenza;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Classi.Soccorso.Eventi;
using SO115App.API.Models.Classi.Soccorso.Eventi.Partenze;
using SO115App.API.Models.Classi.Soccorso.Eventi.Segnalazioni;
using SO115App.Persistence.MongoDB.Mappings;
using System.Runtime.CompilerServices;

[assembly: InternalsVisibleTo("SO115App.CompositionRoot")]

namespace Persistence.MongoDB
{
    public class DbContext
    {
        private readonly IMongoDatabase database;

        public DbContext(string mongoUrl, string databaseName)
        {
            this.database = InitDbInstance(mongoUrl, databaseName);
            InitDbSettings();
            MapClasses();
        }

        private IMongoDatabase InitDbInstance(string mongoUrl, string databaseName)
        {
            var client = new MongoClient(mongoUrl);
            return client.GetDatabase(databaseName);
        }

        private void InitDbSettings()
        {
            var pack = new ConventionPack();
            pack.Add(new CamelCaseElementNameConvention());
            ConventionRegistry.Register("camel case", pack, t => true);
        }

        private void MapClasses()
        {
            EntityMap.Map();

            ///Non più necessario grazie a MongoDB
            //BsonClassMap.RegisterClassMap<Evento>(cm =>
            //{
            //    cm.AutoMap();
            //    cm.MapProperty("TipoEvento").SetElementName("tipoEvento");
            //});

            BsonClassMap.RegisterClassMap<Segnalazione>(cm =>
            {
                cm.AutoMap();
                cm.MapProperty("Codice");
            });

            BsonClassMap.RegisterClassMap<Telefonata>(cm =>
            {
                cm.AutoMap();
            });

            BsonClassMap.RegisterClassMap<AssegnazionePriorita>(cm =>
            {
                cm.AutoMap();
            });

            BsonClassMap.RegisterClassMap<InizioPresaInCarico>(cm =>
            {
                cm.AutoMap();
            });

            BsonClassMap.RegisterClassMap<ComposizionePartenze>(cm =>
            {
                cm.AutoMap();
            });

            BsonClassMap.RegisterClassMap<AssegnataRichiesta>(cm =>
            {
                cm.AutoMap();
            });

            BsonClassMap.RegisterClassMap<ArrivoSulPosto>(cm =>
            {
                cm.AutoMap();
            });

            BsonClassMap.RegisterClassMap<RichiestaPresidiata>(cm =>
            {
                cm.AutoMap();
            });

            BsonClassMap.RegisterClassMap<PartenzaRientrata>(cm =>
            {
                cm.AutoMap();
            });

            BsonClassMap.RegisterClassMap<PartenzaInRientro>(cm =>
            {
                cm.AutoMap();
            });

            BsonClassMap.RegisterClassMap<ChiusuraRichiesta>(cm =>
            {
                cm.AutoMap();
            });

            BsonClassMap.RegisterClassMap<RiaperturaRichiesta>(cm =>
            {
                cm.AutoMap();
            });

            BsonClassMap.RegisterClassMap<RichiestaAssistenza>(cm =>
            {
                cm.AutoMap();
                cm.MapField("_eventi").SetElementName("listaEventi");
            });
        }

        public IMongoCollection<RichiestaAssistenza> RichiestaAssistenzaCollection
        {
            get
            {
                return database.GetCollection<RichiestaAssistenza>("richiesteAssistenza");
            }
        }
    }
}
