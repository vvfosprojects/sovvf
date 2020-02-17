using Newtonsoft.Json;
using SO115App.Persistence.Oracle.Classi;
using System;
using System.Collections.Generic;
using System.IO;
using System.Web.Configuration;

namespace SO115App.Persistence.Oracle
{
    public class DBContext
    {
        public Connessione GetConnectionFromCodiceSede(string codSede)
        {
            Connessione connessione = new Connessione();
            string connectionString = WebConfigurationManager.AppSettings[codSede];
            connessione.ConnectionString = connectionString;
            return connessione;
        }
    }
}
