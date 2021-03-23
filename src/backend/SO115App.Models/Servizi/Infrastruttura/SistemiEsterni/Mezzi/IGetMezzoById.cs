using SO115App.API.Models.Classi.Condivise;
using System.Threading.Tasks;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Mezzi
{
    public interface IGetMezzoById
    {
        Task<Mezzo> Get(string CodSede, int CodMezzo);
    }
}
