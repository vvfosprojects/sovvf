using SO115App.Models.Classi.Condivise;
using System.Collections.Generic;

namespace SO115App.ExternalAPI.Fake
{
    public class ProvinciaDTO
    {
        public bool status { get; set; }
        public List<Provincia> elenco { get; set; }

        public int numTotaleOccorrenze { get; set; }

        public string message { get; set; }
    }
}
