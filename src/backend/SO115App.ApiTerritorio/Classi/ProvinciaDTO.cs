using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.ApiTerritorio.Classi
{
    public class ProvinciaDTO
    {
        public bool status { get; set; }
        public List<Provincia> elenco { get; set; }

        public int numTotaleOccorrenze { get; set; }

        public string message { get; set; }
    }
}
