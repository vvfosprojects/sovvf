using SO115App.Persistence.Oracle.Core.Classi;
using System.Collections.Generic;

namespace SO115App.Persistance.Oracle.Core.Interfacce.GestioneMezzi
{
    public interface IGetMezziUtilizzabili
    {
        ORAAutomezzi GetMezzoUtilizzabileByCodMezzo(string CodSede, decimal CodMezzo);

        List<ORAAutomezzi> GetListaAutomezziUtilizzabili(string CodSede);

    }
}
