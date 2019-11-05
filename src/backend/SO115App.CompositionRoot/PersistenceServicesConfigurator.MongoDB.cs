using Microsoft.Extensions.Configuration;
using Persistence.MongoDB;
using SimpleInjector;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Persistence.MongoDB;

namespace SO115App.CompositionRoot
{
    internal static class PersistenceServicesConfigurator_MongoDB
    {
        internal static void Configure(Container container, IConfiguration configuration)
        {
            var connectionString = configuration.GetSection("ConnectionString").Value;
            var databaseName = configuration.GetSection("DatabaseName").Value;

            container.Register<DbContext>(() =>
                new DbContext(connectionString, databaseName), Lifestyle.Singleton);

            container.Register<ISaveRichiestaAssistenza, SaveRichiesta>();
        }
    }
}
