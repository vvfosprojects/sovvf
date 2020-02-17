using SO115App.API.Models.Classi.Autenticazione;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.Infrastruttura.GestioneUtenti.GestioneRuolo
{
    public interface IAddRuoli
    {
        void Add(string codFiscale, List<Role> ruoli);
    }
}
