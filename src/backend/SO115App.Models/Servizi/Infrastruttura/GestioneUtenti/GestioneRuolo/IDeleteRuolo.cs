using SO115App.API.Models.Classi.Autenticazione;

namespace SO115App.Models.Servizi.Infrastruttura.GestioneUtenti.GestioneRuolo
{
    public interface IDeleteRuolo
    {
        void Delete(string codiceFiscale, Role ruolo);
    }
}
