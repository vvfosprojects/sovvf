//-----------------------------------------------------------------------
// <copyright file="Global.asax.cs" company="CNVVF">
// Copyright (C) 2017 - CNVVF
// </copyright>
//-----------------------------------------------------------------------
//
// This file is part of SOVVF.
// SOVVF is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// SOVVF is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

using System.Linq;
using System.Reflection;
using System.Web.Compilation;
using System.Web.Http;
using SimpleInjector;
using SimpleInjector.Integration.WebApi;

namespace RestInterface
{
    /// <summary>
    ///   La web application dell'architettura
    /// </summary>
    public class WebApiApplication : System.Web.HttpApplication
    {
        /// <summary>
        ///   Metodo di inizializzazione della web application. Contiene, tra l'altro, la
        ///   configurazione del motore di dependency injection SimpleInjector.
        /// </summary>
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
