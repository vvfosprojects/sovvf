using Persistence.MongoDB;
using SimpleInjector;
using System;

namespace SO115App.CompositionRoot
{
    internal static class PersistenceServicesConfigurator_MongoDB
    {
        internal static void Configure(Container container)
        {
#warning questo binding deve essere modificato per pescare i valori dalla configurazione IConfiguration
            container.Register<DbContext>(() =>
                new DbContext("mongo://localhost:27017/sovvf", "sovvf"),
                Lifestyle.Singleton);
        }
    }
}
