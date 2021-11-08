using SO115App.API.Models.Classi.Condivise;
using SO115App.Models.Classi.ServiziEsterni.UtenteComune;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti
{
    public interface IGetSedi
    {
        Task<DistaccamentoUC> GetInfoSede(string codSede);
        Task<List<Sede>> GetAll();
    }
}
