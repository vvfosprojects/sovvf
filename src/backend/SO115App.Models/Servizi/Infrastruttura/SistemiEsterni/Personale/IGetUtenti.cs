using SO115App.API.Models.Classi.Autenticazione;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Personale
{
    public interface IGetUtenti
    {
        List<Utente> Get(string codiceSede, string cercaNoC = null);
    }
}
