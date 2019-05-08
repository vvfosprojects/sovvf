using SimpleInjector;
using System.Reflection;

namespace SO115App.CompositionRoot
{
    public static class Configurator
    {
        public static void Bind(Container container)
        {
            CQRSConfigurator.Configure(container);
            ServicesConfigurator.Configure(container);
        }
    }
}