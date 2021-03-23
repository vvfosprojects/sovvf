using SO115App.API.Models.Classi.Autenticazione;

namespace SO115App.Models.Servizi.Infrastruttura.GestioneUtenti
{
    public interface IGetUtenteById
    {
        Utente GetUtenteByCodice(string id);
    }
}
