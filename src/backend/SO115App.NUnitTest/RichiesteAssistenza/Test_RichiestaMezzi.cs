using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using MongoDB.Driver;
using NUnit.Framework;
using Persistence.MongoDB;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.ComposizioneMezzi;
using SO115App.ExternalAPI.Fake.Composizione;
using SO115App.ExternalAPI.Fake.Servizi.ESRI;
using SO115App.ExternalAPI.Fake.Servizi.Gac;
using SO115App.ExternalAPI.Fake.Servizi.GeoFleet;
using SO115App.ExternalAPI.Fake.Servizi.GestioneSedi;
using SO115App.ExternalAPI.Fake.Servizi.OPService;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using SO115App.Models.Servizi.Infrastruttura.GeoFleet;
using SO115App.Models.Servizi.Infrastruttura.GestioneLog;
using SO115App.Models.Servizi.Infrastruttura.GestioneSedi;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.GestioneTipologie;
using SO115App.Models.Servizi.Infrastruttura.GestioneStatoOperativoSquadra;
using SO115App.Models.Servizi.Infrastruttura.GetComposizioneMezzi;
using SO115App.Models.Servizi.Infrastruttura.Notification.CallESRI;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ESRI;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Gac;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Mezzi;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.OPService;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using SO115App.Persistence.MongoDB.GestioneInterventi.GestioneTipologie;
using SO115App.Persistence.MongoDB.GestioneLog;
using SO115App.Persistence.MongoDB.GestioneMezzi;
using SO115App.Persistence.MongoDB.GestioneSedi;
using SO115App.Persistence.MongoDB.GestioneStatoSquadra;

namespace SO115App.NUnitTest.RichiesteAssistenza
{
    [TestFixture]
    public class Test_RichiestaMezzi
    {
        private readonly IGetComposizioneMezzi iGetComposizioneMezzi;
        private readonly DbContext _dbContext;

        public Test_RichiestaMezzi()
        {
            var myConfiguration = new Dictionary<string, string>
            {
                { "ESRI:User", "SO115WEB" },
                { "ESRI:Password", "SO115WEB.1" },
                { "ESRI:URLRichieste", "https://gis.dipvvf.it/server/rest/services/Hosted/Interventi/FeatureServer/1" },
                { "ESRI:URLCompetenze", "https://gis.dipvvf.it/server/rest/services/RankCompetenze/GPServer/RankCompetenze" },
                { "ESRI:URLToken", "https://gis.dipvvf.it/portal/sharing/rest/generateToken" },
                { "DatabaseSettings:ConnectionString", "mongodb://localhost:27017" },
                { "DatabaseSettings:DatabaseName", "sovvf" },
                { "UrlExternalApi:Statri", "http://statri-web-test.dipvvf.it/SO115/" },
                { "UrlExternalApi:IdentityManagement", "https://identitymanagement-be-test.dipvvf.it/api/v1/" },
                { "UrlExternalApi:OPService", "https://opservice-be-test.dipvvf.it/opservice/" },
                { "UrlExternalApi:GestioneQualifiche", "https://gestionequalifiche-be-test.dipvvf.it/api/PUBLIC/" },
                { "UrlExternalApi:GestioneSedi", "https://gestionesedi-be-test.dipvvf.it/api/v3/" },
                { "UrlExternalApi:GestionePersonale", "https://gestionepersonale-be-test.dipvvf.it/api/v1/" },
                { "UrlExternalApi:GeoFleetApi", "http://geofleet-ws.dipvvf.it/api/" },
                { "UrlExternalApi:IdentityManagementApi", "http://172.16.25.10:5000/api/RicercaPerElencoCodiciFiscali" },
                { "UrlExternalApi:UOSApi", "http://172.16.25.10:5001/api/" },
                { "UrlExternalApi:TerritorioApi", "http://172.16.25.10:5002/" },
                { "UrlExternalApi:GacApi", "https://gacweb-test.dipvvf.it/gac-servizi/integrazione" },
                { "UrlExternalApi:PersonaleApiUtenteComuni", "https://wauc-test.dipvvf.it/api/Personale" },
                { "UrlExternalApi:MezziApidipvvf", "http://wauc.dipvvf.it/api/Mezzi" },
                { "UrlExternalApi:InfoSedeApiUtenteComune", "https://wauc-test.dipvvf.it/api/Sedi" },
                { "UrlExternalApi:DistanceMatrix", "https://maps.googleapis.com/maps/api/distancematrix/json?key=AIzaSyAqr7bgViJbF0ckCnNzg9f64P1drVXVqa8" }
            };

            var configuration = new ConfigurationBuilder()
               .AddInMemoryCollection(myConfiguration)
               .Build();

            var connectionString = configuration.GetSection("DatabaseSettings").GetSection("ConnectionString").Value;
            var databaseName = configuration.GetSection("DatabaseSettings").GetSection("DatabaseName").Value;

            _dbContext = new DbContext(connectionString, databaseName);
            var services = new ServiceCollection();
            var httpClient = new HttpClient();
            var _httpcontext = new HttpContextAccessor();

            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "test");

            services.AddMemoryCache();
            services.AddSingleton(httpClient);
            services.TryAddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            services.AddSingleton<IConfiguration>(configuration);
            services.AddSingleton<DbContext>(_dbContext);
            services.AddTransient<IGetComposizioneMezzi, GetComposizioneMezzi>();
            services.AddTransient<IGetSedi, GetSedi>();
            services.AddTransient<IGetStatoMezzi, GetStatoMezzoByCodice>();
            services.AddTransient<IGetStatoSquadra, GetStatoSquadra>();
            services.AddTransient<IGetSquadre, GetSquadre>();
            services.AddTransient<IGetMezziUtilizzabili, GetMezziUtilizzabili>();
            services.AddTransient<IOrdinamentoMezzi, OrdinamentoMezzi>();
            services.AddTransient<IGetAllSediAlberate, GetListaSediAlberata>();
            services.AddTransient<ISetSediAlberate, SetListaSediAlberate>();
            services.AddTransient<IGetAlberaturaUnitaOperative, GetSedi>();
            services.AddTransient<IGetPosizioneFlotta, GetPosizioneFlotta>();
            services.AddTransient<IGetStringCoordinateByCodSede, GetSedi>();
            services.AddTransient<IGetDistanzaTempoMezzi, GetDistanzaTempoMezzi>();
            services.AddTransient<IGetTipologieByCodice, GetTipologieByCodice>();
            services.AddTransient<IGetToken_ESRI, GetToken_ESRI>();
            services.AddTransient<IGetJobId, GetJobId>();
            services.AddTransient<IGetToken, GetToken>();
            services.AddTransient<IWriteLog, WriteLog>();
            services.AddTransient(typeof(ExternalAPI.Client.IHttpRequestManager<>), typeof(ExternalAPI.Client.IHttpRequestManager<>).Assembly.DefinedTypes.First(n => n.Name.Contains("HttpRequestManager")));

            var serviceProvider = services.BuildServiceProvider();
            iGetComposizioneMezzi = serviceProvider.GetService<IGetComposizioneMezzi>();
        }

        [SetUp]
        public void Setup()
        {
        }

        [Test]
        public void GetListaMezziUtilizzabili()
        {
            var richiesta = _dbContext.RichiestaAssistenzaCollection.Find(r => r.Codice.Contains("RM")).FirstOrDefault();

            var query = new ComposizioneMezziQuery()
            {
                CodiciSedi = new[] { "RM.1000" },
                Richiesta = richiesta
            };

            var lista = iGetComposizioneMezzi.Get(query);

            Assert.Pass();
        }
    }
}
