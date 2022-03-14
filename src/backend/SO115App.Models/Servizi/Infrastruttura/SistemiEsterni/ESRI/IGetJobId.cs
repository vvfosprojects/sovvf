using SO115App.Models.Classi.ESRI;
using System.Threading.Tasks;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ESRI
{
    public interface IGetJobId
    {
        Task<string> Get(string token, ESRI_DistanzaTempoMezzi obj);
    }
}
