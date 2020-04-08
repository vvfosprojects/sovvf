using SO115App.API.Models.Classi.Autenticazione;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.Infrastruttura.GestioneUtenti.GetUtenti
{
    public interface IGetUtentiByCodiciSedi
    {
        public List<Utente> Get(List<string> codiciSede, string cercaBy = null);
    }
}
