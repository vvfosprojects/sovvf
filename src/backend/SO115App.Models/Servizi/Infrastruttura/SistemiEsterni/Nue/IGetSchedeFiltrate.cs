﻿using SO115App.Models.Classi.NUE;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue
{
    public interface IGetSchedeFiltrate
    {
        public List<SchedaContatto> Get(string text, bool? gestita, string codiceFiscale, double? rangeOre, string codSede, string classificazione, string codiceSede);
    }
}
