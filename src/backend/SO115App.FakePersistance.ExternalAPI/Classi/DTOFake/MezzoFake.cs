using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.Classi.DTOFake
{
    /// <summary> La classe che mappa i dati in arrivo dal file fake ListaMezzi </summary> </summary>
    public class MezzoFake
    {
        public string Targa { get; set; }
        public string TipoMezzo { get; set; }
        public string Stato { get; set; }
        public string Sede { get; set; }
        public string CodDestinazione { get; set; }
        public string DescDestinazione { get; set; }
    }
}
