using SO115App.API.Models.Classi.Condivise;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Squadre
{
    public interface IGetListaSquadrePerBox
    {
        Task<List<Squadra>> Get(List<string> sedi);
    }
}
