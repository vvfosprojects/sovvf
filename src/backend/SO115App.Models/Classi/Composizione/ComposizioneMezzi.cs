using SO115App.API.Models.Classi.Condivise;

namespace SO115App.API.Models.Classi.Composizione
{
    public class ComposizioneMezzi
    {
        public string Id { get; set; }
        public Mezzo1 Mezzo { get; set; }
        public string Km { get; set; }
        public string TempoPercorrenza { get; set; }
        public Coordinate Coordinate { get; set; }
        public bool Selezionato { get; set; }
        public bool Hover { get; set; }

    }

    public class Distaccamento
    {
        public string Codice { get; set; }
        public string Descrizione { get; set; }
        public Coordinate Coordinate { get; set; }
        public string Indirizzo { get; set; }
        public string Tipo { get; set; }
        public string Regione { get; set; }
        public string Provincia { get; set; }
    }

    public class Mezzo1
    {
        public string Codice { get; set; }
        public string Descrizione { get; set; }
        public string Genere { get; set; }
        public string Stato { get; set; }
        public int Appartenenza { get; set; }
        public Distaccamento Distaccamento { get; set; }
    }
}
