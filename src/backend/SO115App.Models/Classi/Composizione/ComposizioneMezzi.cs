using SO115App.API.Models.Classi.Condivise;

namespace SO115App.API.Models.Classi.Composizione
{
    public class ComposizioneMezzi
    {
        public string id { get; set; }
        public Mezzo1 mezzo { get; set; }
        public string km { get; set; }
        public string tempoPercorrenza { get; set; }
        public Coordinate coordinate { get; set; }
        public bool selezionato { get; set; }
        public bool hover { get; set; }

    }

    public class Distaccamento
    {
        public string codice { get; set; }
        public string descrizione { get; set; }
        public Coordinate coordinate { get; set; }
        public string indirizzo { get; set; }
        public string tipo { get; set; }
        public string regione { get; set; }
        public string provincia { get; set; }
    }

    public class Mezzo1
    {
        public string codice { get; set; }
        public string descrizione { get; set; }
        public string genere { get; set; }
        public string stato { get; set; }
        public int appartenenza { get; set; }
        public Distaccamento distaccamento { get; set; }
    }
}
