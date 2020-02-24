using SO115App.API.Models.Classi.Autenticazione;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.Infrastruttura.Autenticazione
{
    public interface IGetAutorizzazioni
    {
        List<Role> GetAutorizzazioniUtente(string idUtente, string idSede);
    }
}
