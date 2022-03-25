using SO115App.Models.Classi.Utenti.Autenticazione;
using SO115App.Models.Servizi.CQRS.Queries.GestioneUtente.ListaPersonaleVVF;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Personale
{
    public interface IGetPersonaleVVF
    {
        List<PersonaleVVF> Get(PersonaleVVFQuery query, string codSede = null);

        List<PersonaleVVF> GetByCodiceSede(string[] codSede);

        List<AnagraficaPersonaleVVF> GetAnagraficaPersonale(string[] codSede);
    }
}
