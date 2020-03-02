using SO115App.Models.Classi.Utenti.Autenticazione;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Personale
{
    public interface IGetPersonaleByCodSede
    {
        Task<List<PersonaleVVF>> Get(string codSede);
    }
}
