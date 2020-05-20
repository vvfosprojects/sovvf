using Microsoft.Extensions.Configuration;
using SO115App.Persistance.Oracle.Core.Interfacce;
using SO115App.Persistence.Oracle.Core.Classi;

namespace SO115App.Persistence.Oracle.Core
{
    public class DBContext: IDBContext
    {
        private readonly IConfiguration _configuration;

        public DBContext(IConfiguration configuration)
        {
            this._configuration = configuration;
        }

        public Connessione GetConnectionFromCodiceSede(string codSede)
        {
            Connessione connessione = new Connessione();
            string connectionString = _configuration.GetSection("OracleConnections").GetSection(codSede).Value;
            connessione.ConnectionString = connectionString;
            return connessione;
        }
    }
}
