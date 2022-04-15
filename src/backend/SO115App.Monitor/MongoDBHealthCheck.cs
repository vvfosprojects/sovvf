using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace SO115App.Monitor
{
    public class MongoDBHealthCheck : IHealthCheck
    {
        private IMongoDatabase _db { get; set; }
        public MongoClient _mongoClient { get; set; }

        public MongoDBHealthCheck(IOptions<Mongosettings> configuration)
        {
            _mongoClient = new MongoClient(configuration.Value.Connection);

            _db = _mongoClient.GetDatabase(configuration.Value.DatabaseName);
        }

        public async Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
        {
            var healthCheckResultHealthy = await CheckMongoDBConnectionAsync();

            if (healthCheckResultHealthy)
            {
                return HealthCheckResult.Healthy("SOMongoDB health check success");
            }

            return HealthCheckResult.Unhealthy("SOMongoDB health check failure"); ;
        }

        private async Task<bool> CheckMongoDBConnectionAsync()
        {
            try
            {
                await _db.RunCommandAsync((Command<BsonDocument>)"{ping:1}");
            }
            catch (Exception)
            {
                return false;
            }

            return true;
        }
    }
}
