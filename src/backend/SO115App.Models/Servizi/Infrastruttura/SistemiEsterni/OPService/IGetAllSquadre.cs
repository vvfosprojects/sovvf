using SO115App.Models.Classi.Composizione;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.OPService
{
    public interface IGetAllSquadre
    {
        Task<List<ComposizioneSquadra>> GetByCodiceSede(string[] Codice);
    }
}
