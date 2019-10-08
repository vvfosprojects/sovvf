using SO115App.Models.Classi.Condivise;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Territorio
{
    public interface IGetAlberaturaISTAT
    {
        List<Regione> ListaAlberaturaRegioni();
    }
}
