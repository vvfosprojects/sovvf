using Microsoft.Extensions.Configuration;
using Persistence.MongoDB;
using SimpleInjector;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.Box;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Persistence.MongoDB;

namespace SO115App.CompositionRoot
{
    internal static class PersistenceServicesConfigurator_MongoDB
    {
        internal static void Configure(Container container, IConfiguration configuration)
        {
            var connectionString = configuration.GetSection("DatabaseSettings").GetSection("ConnectionString").Value;
            var databaseName = configuration.GetSection("DatabaseSettings").GetSection("DatabaseName").Value;

            container.Register<DbContext>(() =>
                new DbContext(connectionString, databaseName), Lifestyle.Singleton);

            #region Gestione richiesta di assistenza

            container.Register<ISaveRichiestaAssistenza, SaveRichiesta>();
            container.Register<IUpDateRichiestaAssistenza, UpDateRichiesta>();

            container.Register<IGetRichiestaById, GetRichiesta>();
            container.Register<IGetListaSintesi, GetRichiesta>();

            #endregion Gestione richiesta di assistenza

            #region BOX

            container.Register<IGetBoxRichieste, GetBoxRichieste>();

            #endregion BOX
        }
    }
}
