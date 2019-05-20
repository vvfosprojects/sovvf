using SO115App.API.Models.Classi.Condivise;
using System;

namespace SO115App.API.Models.Classi.Composizione
{
    public class ComposizioneMezzi
    {
        public Mezzo Mezzo { get; set; }
        public string Km { get; set; }
        public string TempoPercorrenza { get; set; }
        public Coordinate Coordinate { get; set; }
        public DateTime IstanteScadenzaSelezione { get; set; }
        public string idOperatore { get; set; }
    }
}
