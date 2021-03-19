using SO115App.Models.Classi.ServiziEsterni.AFM;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.AFM
{
    public interface IGetCategorieSoccorsoAereo
    {
        List<CategoriaAFM> Get();
    }
}
