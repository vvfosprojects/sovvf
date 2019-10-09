using SO115App.API.Models.Classi.Condivise;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Gac
{
    public interface IGetMezziUtilizzabili
    {
        List<Mezzo> Get(List<Sede> sedi, string genereMezzo, string siglaMezzo);
    }
}
