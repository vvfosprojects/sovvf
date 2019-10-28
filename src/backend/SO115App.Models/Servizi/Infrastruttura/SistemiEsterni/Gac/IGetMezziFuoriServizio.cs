using SO115App.API.Models.Classi.Condivise;
using SO115App.ApiGac.Models;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Gac
{
    public interface IGetMezziFuoriServizio
    {
        List<MezzoDTO> Get(List<string> sedi, string genereMezzo, string siglaMezzo);
    }
}
