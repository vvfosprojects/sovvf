using SO115App.API.Models.Classi.Condivise;
using System.Threading.Tasks;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Squadre
{
    public interface IGetSquadraById
    {
        Task<Squadra> Get(string CodSede, decimal CodSquadra);
    }
}
