using SO115App.API.Models.Classi.Condivise;
using SO115App.ApiGac.Models;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Gac
{
    public interface IGetMezziBySelettiva
    {
        List<MezzoDTO> Get(List<string> idRadio);
    }
}
