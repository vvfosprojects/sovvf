using SO115App.Models.Classi.MongoDTO;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti
{
    public interface IGetSedi
    {
        List<ListaSedi> GetAll();
        List<ListaSedi> GetSediTrasferimento();
        List<ListaSedi> GetSediAllerta();
    }
}
