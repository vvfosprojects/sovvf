using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using SO115App.Persistance.Oracle.Core.Interfacce;
using SO115App.Persistance.Oracle.Core.Interfacce.GestioneChiamate;
using SO115App.Persistance.Oracle.Core.Interfacce.GestioneMezzi;
using SO115App.Persistance.Oracle.Core.Interfacce.GestioneRichieste;
using SO115App.Persistance.Oracle.Core.Interfacce.GestioneSchedeContatto;
using SO115App.Persistance.Oracle.Core.Interfacce.GestioneServizi;
using SO115App.Persistance.Oracle.Core.Interfacce.GestioneSquadre;
using SO115App.Persistence.Oracle.Core;
using SO115App.Persistence.Oracle.Core.Servizi.GestioneChiamate;
using SO115App.Persistence.Oracle.Core.Servizi.GestioneMezzi;
using SO115App.Persistence.Oracle.Core.Servizi.GestioneRichieste;
using SO115App.Persistence.Oracle.Core.Servizi.GestioneSchedeContatto;
using SO115App.Persistence.Oracle.Core.Servizi.GestioneServizi;
using SO115App.Persistence.Oracle.Core.Servizi.GestioneSquadre;

namespace SO115App.API.Oracle.Core
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();
            Injection(services);         
        }

        private void Injection(IServiceCollection services)
        {
            services.AddScoped<IDBContext, DBContext>();
            services.AddScoped<IGetMezziUtilizzabili, GetListaMezziUtilizzabili>();
            services.AddScoped<IGetRichieste, GetInterventi>();
            services.AddScoped<IGetChiamate, GetChiamate>();
            services.AddScoped<IGetSchedeContatto, GetSchedeContatto>();
            services.AddScoped<IGetSquadre, GetSquadre>();
            services.AddScoped<IGetServizi, GetServizi>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
