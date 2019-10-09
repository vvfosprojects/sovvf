using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Gac
{
    public interface ISetMovimentazione
    {
        void Set(string codiceMezzo, string idRichiesta, string statoOperativo, string timeStamp);
    }
}
