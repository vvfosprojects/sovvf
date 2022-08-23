using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http.Connections;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using WSSignlR.Hubs;

namespace WSSignlR
{
    public class Startup
    {
        private readonly string MyAllowSpecificOrigins = "AllowSpecificOrigin";

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
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

            services.AddControllers();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "WSSignlR", Version = "v1" });
            });

            services.AddSignalR()
                .AddStackExchangeRedis(Configuration.GetSection("UrlRedis").Value, o =>
                {
                    o.Configuration.ChannelPrefix = "SO115Web";
                    o.ConnectionFactory = async writer =>
                    {
                        var config = new ConfigurationOptions
                        {
                            AbortOnConnectFail = false
                        };
                        config.EndPoints.Add(IPAddress.Loopback, 0);
                        config.SetDefaultPorts();
                        var connection = await ConnectionMultiplexer.ConnectAsync(config, writer);
                        connection.ConnectionFailed += (_, e) =>
                        {
                            Console.WriteLine("Connection to Redis failed.");
                        };

                        if (!connection.IsConnected)
                        {
                            Console.WriteLine("Did not connect to Redis.");
                        }

                        return connection;
                    };
                })
                .AddNewtonsoftJsonProtocol(opt =>
                {
                    opt.PayloadSerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
                })
                .AddHubOptions<SubHub>(options =>
                {
                    options.EnableDetailedErrors = true;
                    options.ClientTimeoutInterval = TimeSpan.FromMinutes(480);
                    options.KeepAliveInterval = TimeSpan.FromMinutes(15);
                    options.HandshakeTimeout = TimeSpan.FromMinutes(480);
                    options.MaximumReceiveMessageSize = 300000;
                });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "WSSignlR v1"));
            }

            app.UseHttpsRedirection();

            app.UseRouting();
            app.UseCors(MyAllowSpecificOrigins);
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapHub<SubHub>("/SubHub", options =>
                {
                    options.Transports =
                        HttpTransportType.WebSockets |
                        HttpTransportType.LongPolling;
                });

                endpoints.MapControllers();
            });

            app.UseHttpsRedirection();
        }
    }
}