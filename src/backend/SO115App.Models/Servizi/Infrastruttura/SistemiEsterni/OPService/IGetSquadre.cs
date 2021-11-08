using SO115App.Models.Classi.ServiziEsterni.OPService;
using System.Threading.Tasks;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.OPService
{
    public interface IGetSquadre
    {
        Task<WorkShift> GetAllByCodiceDistaccamento(string Codice);
    }
}
