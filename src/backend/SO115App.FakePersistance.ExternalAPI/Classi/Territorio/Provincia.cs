using System.Collections.Generic;

namespace SO115App.ExternalAPI.Fake
{
    public class Provincia
    {
        public string codProvincia { get; set; }
        public string descProvincia { get; set; }
        public string codRegione { get; set; }

        public List<Comune> ListaComuni { get; set; }
    }
}
