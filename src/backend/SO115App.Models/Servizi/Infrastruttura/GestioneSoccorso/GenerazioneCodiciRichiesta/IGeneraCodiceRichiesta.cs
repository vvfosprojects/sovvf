namespace SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.GenerazioneCodiciRichiesta
{
    public interface IGeneraCodiceRichiesta
    {
        string GeneraCodiceChiamata(string codiceProvincia, int anno);

        string GeneraCodiceIntervento(string codiceProvincia, int anno);
    }
}
