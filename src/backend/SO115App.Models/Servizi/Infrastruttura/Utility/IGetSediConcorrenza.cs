using SO115App.Models.Classi.Concorrenza;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.Infrastruttura.Utility
{
    public interface IGetSediConcorrenza
    {
        public List<string> Get(TipoOperazione tipo, string value, string codSede);
    }
}
