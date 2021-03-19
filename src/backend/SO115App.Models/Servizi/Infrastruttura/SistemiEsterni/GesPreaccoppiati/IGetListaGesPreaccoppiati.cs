using SO115App.API.Models.Classi.Composizione;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.GesPreaccoppiati
{
    public interface IGetListaGesPreaccoppiati
    {
        Task<List<PreAccoppiati>> Get(string CodSede);
    }
}
