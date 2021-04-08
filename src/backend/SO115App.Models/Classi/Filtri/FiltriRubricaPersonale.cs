namespace SO115App.Models.Classi.Filtri
{
    public class FiltriRubricaPersonale
    {
        public string Search { get; set; }
        public string Stato { get; set; }
        public string Tipo { get; set; }
    }

    public static class StatoPersonaleRubrica
    {
        public const string InServizio = "In servizio";
        public const string NonInServizio = "Non in servizio";
    }

    public static class TipoPersonaleRubrica
    {
        public const string SoloOperativi = "Solo operativi";
        public const string AltroPersonale = "Altro personale";
    }
}