namespace SO115App.Models.Classi.ServiziEsterni.Rubrica
{
    public class DettaglioQualificaResult
    {
        public DatiQualifica[] dati { get; set; }
    }

    public class DatiQualifica
    {
        public string idDipendente { get; set; }

        public string codQualifica { get; set; }
    }
}
