using System.Linq;
using System.Reflection;
using System.Web.Compilation;
using System.Web.Http;
using SimpleInjector;
using SimpleInjector.Integration.WebApi;

namespace RestInterface
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            // Create the container as usual.
            var container = new Container();
            container.Options.DefaultScopedLifestyle = new WebApiRequestLifestyle();

            // Scan all the referenced assemblies for packages containing DI wiring rules
            var assemblies = BuildManager.GetReferencedAssemblies().Cast<Assembly>();
            container.RegisterPackages(assemblies);

            // This is an extension method from the integration package.
            container.RegisterWebApiControllers(GlobalConfiguration.Configuration);

#if DEBUG
            container.Verify();
#endif

            GlobalConfiguration.Configuration.DependencyResolver =
                new SimpleInjectorWebApiDependencyResolver(container);

            // Here your usual Web API configuration stuff.
            GlobalConfiguration.Configure(WebApiConfig.Register);
        }
    }
}
