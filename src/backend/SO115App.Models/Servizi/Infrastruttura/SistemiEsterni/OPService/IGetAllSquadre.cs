using SO115App.Models.Classi.Composizione;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.OPService
{
    public interface IGetAllSquadre
    {
        List<SquadraComposizione> GetByCodiceSede(string[] Codice);
    }
}
