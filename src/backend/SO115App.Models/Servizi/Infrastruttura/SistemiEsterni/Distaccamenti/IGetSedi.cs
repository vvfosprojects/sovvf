using SO115App.Models.Classi.MongoDTO;
using SO115App.Models.Classi.ServiziEsterni.UtenteComune;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti
{
    public interface IGetSedi
    {
        DistaccamentoUC GetInfoSede(string codSede);
        List<ListaSedi> GetAll();
    }
}
