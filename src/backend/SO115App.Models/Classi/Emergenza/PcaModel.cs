using SO115App.API.Models.Classi.Condivise;


namespace SO115App.Models.Classi.Emergenza
{
    public class PcaModel
    {
        public string Codice { get; set; }
        public string Nome { get; set; }
        public string Indirizzo { get; set; }
        public Coordinate Coordinate { get; set; }
        public string[] Dirigenti { get; set; }
    }
}
