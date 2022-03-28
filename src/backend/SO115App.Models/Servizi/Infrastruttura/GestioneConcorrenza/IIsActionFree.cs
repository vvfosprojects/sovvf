using SO115App.Models.Classi.Concorrenza;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.Infrastruttura.GestioneConcorrenza
{
    public interface IIsActionFree
    {
        public bool Check(string action);
    }
}
