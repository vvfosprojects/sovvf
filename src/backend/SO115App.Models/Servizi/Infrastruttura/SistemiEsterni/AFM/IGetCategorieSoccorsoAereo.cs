using SO115App.Models.Classi.ServiziEsterni.AFM;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.AFM
{
    public interface IGetCategorieSoccorsoAereo
    {
        List<CategoriaAFM> Get();
    }
}
