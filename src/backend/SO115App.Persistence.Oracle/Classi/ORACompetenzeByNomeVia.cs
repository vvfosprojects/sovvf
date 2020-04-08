using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SO115App.Persistence.Oracle.Classi
{
    public class ORACompetenzeByNomeVia
    {
        public string CODSEDE { get; set; }
        public int CODDISTAC { get; set; }
        public int COD_DISTACCAMENTO1 { get; set; }

        public string DESC_DISTACCAMENTO1 { get; set; }
        public int COD_DISTACCAMENTO2 { get; set; }
        public string DESC_DISTACCAMENTO2 { get; set; }
        public int COD_DISTACCAMENTO3 { get; set; }
        public string DESC_DISTACCAMENTO3 { get; set; }
        public int ID_ZONA { get; set; }
        public int ID_ZONA2 { get; set; }
        public int ID_ZONA3 { get; set; }
        public string NOMEVIA { get; set; }
        public string COMUNE { get; set; }
        public string SIGLA_PROVINCIA { get; set; }
        public string LFTFSTHNR { get; set; }
        public string LFTLSTHNR { get; set; }
        public string RGHTFSTHNR { get; set; }
        public string RGHTLSTHNR { get; set; }
    }
}
