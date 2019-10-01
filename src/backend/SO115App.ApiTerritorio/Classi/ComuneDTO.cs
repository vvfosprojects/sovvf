using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.ApiTerritorio.Classi
{
    public class ComuneDTO
    {
        public bool status { get; set; }
        public List<Comune> dati { get; set; }

        public int numTotaleOccorrenze { get; set; }

        public string message { get; set; }
    }
}
