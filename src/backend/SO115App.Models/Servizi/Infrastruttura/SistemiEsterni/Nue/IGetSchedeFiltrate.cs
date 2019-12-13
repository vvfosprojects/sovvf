using SO115App.Models.Classi.NUE;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue
{
    public interface IGetSchedeFiltrate
    {
        public List<SchedaContatto> Get(string text, bool? gestita, bool? letta, string codiceFiscale, int? rangeOre);
    }
}
