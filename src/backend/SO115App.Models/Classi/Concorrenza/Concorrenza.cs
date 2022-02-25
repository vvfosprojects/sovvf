namespace SO115App.Models.Classi.Concorrenza
{
    public class Concorrenza
    {
        public string Id { get; set; }
        public string IdOperatore { get; set; }
        public TipoOperazione Type { get; set; }
        public string Value { get; set; }
        public string CodComando { get; set; }
    }
}
