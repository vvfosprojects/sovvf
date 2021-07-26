namespace SO115App.Models.Classi.Composizione
{
    public class FiltriComposizioneMezzo
    {
        public string Ricerca { get; set; }
        public string CodDistaccamentoSelezionato { get; set; }
        public string[]? Stato { get; set; }
        public string[]? CodiciDistaccamenti { get; set; }
        public string[]? Tipo { get; set; }
        public string CodMezzoSelezionato { get; set; }
    }
}
