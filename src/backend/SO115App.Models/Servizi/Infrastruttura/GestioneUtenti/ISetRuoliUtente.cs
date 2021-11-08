using SO115App.API.Models.Classi.Autenticazione;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.Infrastruttura.GestioneUtenti
{
    public interface ISetRuoliUtente
    {
        void Set(string codiceFiscale, List<Role> ruoli);
    }
}
