//-----------------------------------------------------------------------
// <copyright file="Startup.cs" company="CNVVF">
// Copyright (C) 2017 - CNVVF
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
// along with this program.  If not, see http://www.gnu.org/licenses/.
// </copyright>
//-----------------------------------------------------------------------
using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Connections;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Mvc.ViewComponents;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Serilog;
using SimpleInjector;
using SimpleInjector.Integration.AspNetCore.Mvc;
using SimpleInjector.Lifestyles;
using SO115App.CompositionRoot;
using SO115App.Logging;
using SO115App.Models.Servizi.CustomMapper;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue;
using SO115App.SignalR;
using StackExchange.Redis;
using System;
using System.IO;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Principal;
using System.Text;
using System.Threading;

namespace SO115App.API
{
    public class Startup
    {
        private readonly Container container = new Container();
        private readonly string MyAllowSpecificOrigins = "AllowSpecificOrigin";

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }
        public IWatchChangeSchedeNue WatchChangeSchedeNue { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            ///<summary>
            ///Registrazione dei servizi Cors
            /// </summary>
            ///
            services.AddCors(options =>
            {
                options.AddPolicy(MyAllowSpecificOrigins,
                builder =>
                {
                    builder
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials()
                        .WithOrigins(Configuration.GetSection("AllowedOriginLocal").Value,
                                     Configuration.GetSection("AllowedOriginTest").Value,
                                     Configuration.GetSection("AllowedOriginProd").Value,
                                     Configuration.GetSection("AllowedOriginMatrix").Value)
                        .SetIsOriginAllowedToAllowWildcardSubdomains()
                        .WithExposedHeaders("codicesede", "hubconnectionid", "idUtente", "localip", "DNT", "user-agent", "x-requested-with",
                                            "If-Modified-Since", "Cache-Control", "content-type", "range", "accept", "authorization", "origin");
                });
            });

            var httpClient = new HttpClient();
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "test");
            services.AddSingleton(httpClient);
            services.AddControllers();

            services.AddControllersWithViews();
            services.AddHttpContextAccessor();

            services.AddMemoryCache();
            services.AddMvcCore().AddApiExplorer().AddNewtonsoftJson(options =>
            {
                options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
            });
            services.AddSwaggerGen(c =>
            {
                c.CustomSchemaIds(type => type.ToString());
                c.SwaggerDoc("SO115", new Microsoft.OpenApi.Models.OpenApiInfo { Title = "SO115", Version = "v1.0" });
                var filePath = Path.Combine(System.AppContext.BaseDirectory, "SO115App.API.xml");
                c.IncludeXmlComments(filePath);
            });

            ///<summary>
            ///Registrazione dei servizi AutoMapper
            /// </summary>
            services.AddAutoMapper(typeof(Startup));
            var config = new MapperConfigure().Configure();
            services.AddSingleton<IMapper>(sp => config.CreateMapper());

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(option =>
                {
                    option.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(Configuration.GetSection("AppSettings:Token").Value)),
                        ValidateIssuer = false,
                        ValidateAudience = false
                    };
                });

            services.AddSignalR()
                //.AddStackExchangeRedis(Configuration.GetSection("UrlRedis").Value, options =>
                // {
                //    options.Configuration.ChannelPrefix = "SO115Web";
                //})
                .AddNewtonsoftJsonProtocol(opt =>
                {
                    opt.PayloadSerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
                })
                .AddHubOptions<NotificationHub>(options =>
                {
                    options.EnableDetailedErrors = true;
                    options.ClientTimeoutInterval = TimeSpan.FromMinutes(480);
                    options.KeepAliveInterval = TimeSpan.FromMinutes(15);
                    options.HandshakeTimeout = TimeSpan.FromMinutes(480);
                    options.MaximumReceiveMessageSize = 300000;
                });
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

            services.AddSimpleInjector(container, option => option.AddAspNetCore().AddControllerActivation());
            services.EnableSimpleInjectorCrossWiring(container);
            services.UseSimpleInjectorAspNetRequestScoping(container);

            Log.Information("Avvio");
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseSimpleInjector(container);
            LogConfigurator.Configure(Configuration);

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                // The default HSTS value is 30 days. You may want to change this for production
                // scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseStaticFiles();
            app.UseRouting();
            app.UseCors(MyAllowSpecificOrigins);
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapHub<NotificationHub>("/NotificationHub", options =>
                {
                    options.Transports =
                        HttpTransportType.WebSockets |
                        HttpTransportType.LongPolling;
                });
                endpoints.MapControllers();
            });

            app.UseHttpsRedirection();

            app.UseSwagger();

            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/SO115/swagger.json", "SO115");
            });
            //SIMPLE INJECTION INIZIALIZE COMPONENT
            InitializeContainer(app);
            container.RegisterSingleton<IPrincipal, HttpContextPrincipal>();
            container.Verify();
        }

        private void InitializeContainer(IApplicationBuilder app)
        {
            // Add application presentation components:
            //container.RegisterMvcControllers(app);

            Configurator.Bind(container, Configuration);

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

            private IPrincipal Principal => this.httpContextAccessor.HttpContext.User;
            public IIdentity Identity => this.Principal.Identity;

            public bool IsInRole(string role) => this.Principal.IsInRole(role);
        }
    }
}
