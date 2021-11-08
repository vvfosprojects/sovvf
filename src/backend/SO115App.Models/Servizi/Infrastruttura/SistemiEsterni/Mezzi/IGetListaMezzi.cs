using SO115App.API.Models.Classi.Condivise;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Mezzi
{
    public interface IGetListaMezzi
    {
        Task<List<Mezzo>> Get(string CodSede);
    }
}
