using System.Collections.Generic;

namespace SO115App.Models.Servizi.Infrastruttura.Utility
{
    public interface IGetSottoSediByCodSede
    {
        List<string> Get(string[] codSede);
    }
}
