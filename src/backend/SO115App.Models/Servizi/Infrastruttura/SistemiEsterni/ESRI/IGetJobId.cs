using System.Threading.Tasks;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ESRI
{
    public interface IGetJobId
    {
        Task<string> Get(string token);
    }
}
