using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using SO115App.API.Hubs;
using SimpleInjector;
using SimpleInjector.Integration.AspNetCore.Mvc;
using SimpleInjector.Lifestyles;
using Microsoft.AspNetCore.Mvc.ViewComponents;
using System.Security.Principal;
using System.Diagnostics;
using SO115App.API.Models.Servizi.Infrastruttura;
using SO115App.Logging;
using SO115App.CompositionRoot;

namespace SO115App.API
{
    public class Startup
    {

        private Container container = new Container();

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
            services.AddCors(options =>
            {
                options.AddPolicy("CorsSo115",
                builder =>
                {
                    builder
                        .AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials();                
                });
            });
        
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(option => {
                    option.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(Configuration.GetSection("AppSettings:Token").Value)),
                        ValidateIssuer = false,
                        ValidateAudience = false
                    };
                }); 
            services.AddSignalR();
            services.AddProgressiveWebApp();
            IntegrateSimpleInjector(services);
        }

        private void IntegrateSimpleInjector(IServiceCollection services)
        {
            container.Options.DefaultScopedLifestyle = new AsyncScopedLifestyle();

            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

            services.AddSingleton<IControllerActivator>(
                new SimpleInjectorControllerActivator(container));
            services.AddSingleton<IViewComponentActivator>(
                new SimpleInjectorViewComponentActivator(container));

            services.EnableSimpleInjectorCrossWiring(container);
            services.UseSimpleInjectorAspNetRequestScoping(container);
  
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {

            LogConfigurator.Configure();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseCors("CorsSo115");
            app.UseAuthentication();

            app.UseSignalR( route => 
                {
                    //route.MapHub<SubscriptionHub>("/SubscriptionHub");
                    route.MapHub<NotificationHub>("/NotificationHub");
                    //route.MapHub<NotificationHub>("/NotificationMarkerHub");                    
                }
            );  

            app.UseHttpsRedirection();
            app.UseMvc();

            //SIMPLE INJECTION INIZIALIZE COMPONENT
            InitializeContainer(app);
            container.RegisterSingleton<IPrincipal, HttpContextPrincipal>();
            container.RegisterInstance<ILogger>(new DebugLogger());
            container.Verify();
             
        }

        private void InitializeContainer(IApplicationBuilder app)
        {
            // Add application presentation components:
            container.RegisterMvcControllers(app);
            container.RegisterMvcViewComponents(app);

            Configurator.Bind(container);

            // Allow Simple Injector to resolve services from ASP.NET Core.
            container.AutoCrossWireAspNetComponents(app);
        }

        private sealed class HttpContextPrincipal : IPrincipal
        {
            private readonly IHttpContextAccessor httpContextAccessor;

            public HttpContextPrincipal(IHttpContextAccessor httpContextAccessor)
            {
                this.httpContextAccessor = httpContextAccessor;
            }
            public IIdentity Identity => this.Principal.Identity;
            private IPrincipal Principal => this.httpContextAccessor.HttpContext.User;
            public bool IsInRole(string role) => this.Principal.IsInRole(role);
        }

        private sealed class DebugLogger : ILogger
        {
            public void Log(string message)
            {
                //Trace.WriteLine(message);
                Debug.WriteLine(message);
            }
        }

    }
}
