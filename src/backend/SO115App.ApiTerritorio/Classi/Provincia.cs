using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.ApiTerritorio.Classi
{
    public class Provincia
    {
        public string codProvincia { get; set; }
        public string descProvincia { get; set; }
        public string codRegione { get; set; }

        public List<Comune> ListaComuni { get; set; }
    }
}
