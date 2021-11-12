using SO115App.API.Models.Classi.Condivise;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Classi.Emergenza
{
    public class DoaModel
    {
        public string Codice { get; set; }
        public string Nome { get; set; }
        public string Indirizzo { get; set; }
        public Coordinate Coordinate { get; set; }
        public string[] Dirigenti { get; set; }
        public string[] ListaComuniInteressati { get; set; }
        public List<ModuliColonnaMobile> ListaModuliColonnaMobile { get; set; }
        public List<PcaModel> ListaPca { get; set; }
    }
}
