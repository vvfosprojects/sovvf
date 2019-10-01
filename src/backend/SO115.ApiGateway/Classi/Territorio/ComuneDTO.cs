using System.Collections.Generic;

namespace SO115App.ApiGateway.Classi
{
    public class ComuneDTO
    {
        public bool status { get; set; }
        public List<Comune> dati { get; set; }

        public int numTotaleOccorrenze { get; set; }

        public string message { get; set; }
    }
}
