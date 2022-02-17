using SO115App.Models.Classi.ESRI;
using System.Threading.Tasks;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ESRI
{
    public interface IGetDistanzaTempoMezzi
    {
        Task<ESRI_DistanzaTempoMezzoResponse> Get(ESRI_DistanzaTempoMezzi obj);
    }
}
