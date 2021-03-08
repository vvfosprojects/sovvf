using SO115App.API.Models.Classi.Condivise;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Squadre
{
    public interface IGetListaSquadre
    {
        Task<IEnumerable<Squadra>> Get(List<string> sedi);
    }
}
