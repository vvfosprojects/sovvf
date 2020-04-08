using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SO115App.Persistence.Oracle.Classi
{
    public class Connessione
    {
        public string CodiceSede { get; set; }
        public bool Abilitazione { get; set; }
        public string ConnectionString { get; set; }
    }
}
