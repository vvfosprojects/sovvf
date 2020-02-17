using SO115App.Models.Classi.Utenti.Autenticazione;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Personale
{
    public interface IGetPersonaleByCF
    {
        Task<PersonaleVVF> Get(string codiceFiscale, string codSede);
    }
}
