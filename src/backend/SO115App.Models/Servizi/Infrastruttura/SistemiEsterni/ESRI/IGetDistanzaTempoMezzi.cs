using SO115App.Models.Classi.ESRI;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ESRI
{
    public interface IGetDistanzaTempoMezzi
    {
        Task<List<ESRI_MezzoResponse>> Get(ESRI_DistanzaTempoMezzi obj);
    }
}
