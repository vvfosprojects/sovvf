namespace SO115App.Models.Classi.Filtri
{
    public class FiltriRubricaPersonale
    {
        public string Search { get; set; }
        public string Stato { get; set; }
        public string Tipo { get; set; }
    }

    public static class StatoPersonale
    {
        public const string InServizio = "In servizio";
        public const string NonInServizio = "Non in servizio";
    }
}