using System.Collections.Generic;

namespace SO115App.Models.Classi.Condivise
{
    public class Provincia
    {
        public string codProvincia { get; set; }
        public string Nome { get; set; }

        public string codRegione { get; set; }
        public List<Comune> ListaComuni { get; set; }
    }
}
