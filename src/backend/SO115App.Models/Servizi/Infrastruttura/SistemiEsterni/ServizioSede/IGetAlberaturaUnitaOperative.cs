using SO115App.API.Models.Classi.Organigramma;
using System.Threading.Tasks;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede
{
    public interface IGetAlberaturaUnitaOperative
    {
        Task<UnitaOperativa> ListaSediAlberata();
    }
}
