namespace SO115App.Models.Servizi.Infrastruttura.GestioneEmergenza
{
    public interface IGetCodiceEmergenza
    {
        public string Get(string codComando, string Tipologia);
    }
}
