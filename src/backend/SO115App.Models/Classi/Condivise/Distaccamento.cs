using SO115App.API.Models.Classi.Condivise;

namespace SO115App.Models.Classi.Condivise
{
    public class Distaccamento
    {
        public string Id { get; set; }
        public int CodDistaccamento { get; set; }
        public string DescDistaccamento { get; set; }
        public string Nome => DescDistaccamento.Replace("Dipartimento C.N.VV.F", "CON");
        public string CodSede { get; set; }
        public string Indirizzo { get; set; }
        public string Cap { get; set; }
        public Coordinate Coordinate { get; set; }
        public string[] CoordinateString { get; set; }
    }
}
