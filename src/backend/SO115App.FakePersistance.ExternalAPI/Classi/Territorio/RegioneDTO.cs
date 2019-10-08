using System.Collections.Generic;

namespace SO115App.ExternalAPI.Fake
{
    public class RegioneDTO
    {
        public bool status { get; set; }
        public List<Regione> dati { get; set; }

        public int numTotaleOccorrenze { get; set; }

        public string message { get; set; }
    }
}
