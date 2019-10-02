using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.ApiTerritorio.Classi
{
    public class RegioneDTO
    {
        public bool status { get; set; }
        public List<Regione> dati { get; set; }

        public int numTotaleOccorrenze { get; set; }

        public string message { get; set; }
    }
}
