namespace SO115App.Models.Servizi.Infrastruttura.GestioneEmergenza
{
    public interface IGetCodiceEmergenza
    {
        public string GetCodProvinciale(string Regione, string Provincia, string Tipologia);

        public string GetCodRegionale(string codRegione, string Tipologia);

        public string GetCodCon(string Tipologia);
    }
}
