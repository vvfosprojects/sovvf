using SO115App.Persistence.Oracle.Core.Classi;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Persistance.Oracle.Core.Interfacce.GestioneRichieste
{
    public interface IGetRichieste
    {
        List<ORAInterventiChiusi> GetListaInterventiChiusi(string CodSede);

        List<ORAInterventi> GetListaInterventi(string CodSede);
    }
}
