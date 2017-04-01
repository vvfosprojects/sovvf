using Modello.Servizi.Infrastruttura.Autenticazione;
using SimpleInjector;
using SimpleInjector.Packaging;
using SOVVF.FakeImplementations.Modello.Autenticazione;

namespace SOVVF.FakeImplementations
{
    /// <summary>
    ///   Bindings delle implementazioni fake
    /// </summary>
    public class Bindings : IPackage
    {
        public void RegisterServices(Container container)
        {
            container.Register<IGetOperatoreAutenticato, GetOperatoreAutenticato>();
        }
    }
}
