using SO115App.API.Models.Classi.Condivise;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Tipologie
{
    public interface IGetListaTipologie
    {
        public List<Tipologia> ListaTipologie(string CodSede);
    }
}
