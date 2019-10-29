using SO115App.API.Models.Classi.Condivise;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Gac
{
    public interface IGetMezziFuoriServizio
    {
        List<Mezzo> Get(List<string> sedi, string genereMezzo, string siglaMezzo);
    }
}
