using SO115App.API.Models.Classi.Condivise;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Classi.Emergenza
{
    public class CraTreeData
    {
        public string Id { get; set; }
        public string ItemValue { get; set; }
        public Coordinate Coordinate { get; set; }
        public string Indirizzo { get; set; }
        public string[] Responsabili { get; set; }
        public string[] ListaComandiInteressati { get; set; }
        public List<ModuliColonnaMobile> ListaModuli { get; set; }
    }
}
