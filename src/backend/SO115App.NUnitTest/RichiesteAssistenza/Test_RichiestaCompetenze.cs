using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using CQRS.Queries;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using NUnit.Framework;
using Persistence.MongoDB;
using SimpleInjector;
using SO115App.ExternalAPI.Fake.Servizi.ESRI;
using SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GetCompetenze;
using SO115App.Models.Servizi.Infrastruttura.GestioneLog;
using SO115App.Models.Servizi.Infrastruttura.Notification.CallESRI;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Competenze;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using SO115App.Persistence.MongoDB.GestioneLog;

namespace SO115App.NUnitTest.RichiesteAssistenza
{
    [TestFixture]
    public class Test_RichiestaCompetenze
    {
        private readonly IGetCompetenzeByCoordinateIntervento _queryHandler;

        public Test_RichiestaCompetenze()
        {
            //"ESRI": {
            //  "URLRichieste": "https://gis.dipvvf.it/server/rest/services/Hosted/Interventi/FeatureServer/1",
            //  "URLSchedeContatto": "https://gis.dipvvf.it/server/rest/services/Hosted/SchedeContatto/FeatureServer/1",
            //  "URLCompetenze": "https://gis.dipvvf.it/server/rest/services/RankCompetenze/GPServer/RankCompetenze",
            //  "URLToken": "https://gis.dipvvf.it/portal/sharing/rest/generateToken",
            //  "URLJobId": "https://gis.dipvvf.it/server/rest/services/Rank_Competenze_Distanza/GPServer/Rank%20Competenze%20Distanza/submitJob?token={token}&f=json",
            //  "URLDistanzaTempoMezzo": "https://gis.dipvvf.it/server/rest/services/Rank_Competenze_Distanza/GPServer/Rank%20Competenze%20Distanza/jobs/{jobId}/results/Return?f=json&token={token}",
            //  "User": "asdasd",
            //  "Password": "asdasdasdasda"
            //}

            var myConfiguration = new Dictionary<string, string>
            {
                {"ESRI:User", "SO115WEB"},
                {"ESRI:Password", "SO115WEB.1"},
                {"ESRI:URLRichieste", "https://gis.dipvvf.it/server/rest/services/Hosted/Interventi/FeatureServer/1"},
                {"ESRI:URLCompetenze", "https://gis.dipvvf.it/server/rest/services/RankCompetenze/GPServer/RankCompetenze"},
                {"ESRI:URLToken", "https://gis.dipvvf.it/portal/sharing/rest/generateToken"},
                {"DatabaseSettings:ConnectionString","mongodb://localhost:27017" },
                {"DatabaseSettings:DatabaseName","sovvf" },
            };
            var configuration = new ConfigurationBuilder()
                .AddInMemoryCollection(myConfiguration)
                .Build();

            var connectionString = configuration.GetSection("DatabaseSettings").GetSection("ConnectionString").Value;
            var databaseName = configuration.GetSection("DatabaseSettings").GetSection("DatabaseName").Value;

            var dbContext = new DbContext(connectionString, databaseName);
            var services = new ServiceCollection();
            var httpClient = new HttpClient();
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "test");
            services.AddMemoryCache();
            services.AddSingleton(httpClient);
            services.TryAddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            services.AddSingleton<IConfiguration>(configuration);
            services.AddSingleton<DbContext>(dbContext);
            services.AddTransient<IGetCompetenzeByCoordinateIntervento, GetCompetenzeByCoordinateIntervento>();
            services.AddTransient<IGetToken_ESRI, GetToken_ESRI>();
            services.AddTransient<IWriteLog, WriteLog>();
            services.AddTransient(typeof(ExternalAPI.Client.IHttpRequestManager<>), typeof(ExternalAPI.Client.IHttpRequestManager<>).Assembly.DefinedTypes.First(n => n.Name.Contains("HttpRequestManager")));

            var serviceProvider = services.BuildServiceProvider();

            _queryHandler = serviceProvider.GetService<IGetCompetenzeByCoordinateIntervento>();
        }

        [SetUp]
        public void Setup()
        {
        }

        [Test]
        public void Get()
        {
            try
            {
                for (int i = 0; i < 20; i++)
                {
                    var query = new GetCompetenzeQuery()
                    {
                        CodiciSede = new string[1] { "RM.1000" },
                        IdOperatore = "5e53e1450325498641f2fe2b",
                        Coordinate = new API.Models.Classi.Condivise.Coordinate(41.89996, 12.49104)
                    };

                    var comp = _queryHandler.GetCompetenzeByCoordinateIntervento(query.Coordinate);
                }

                //Assert.Pass($"Elenco Competenze: {String.Join(",", comp)}");
            }
            catch (Exception e)
            {
                Assert.Fail($"Error in CATCH: {e.Message}");
            }
        }
    }
}
