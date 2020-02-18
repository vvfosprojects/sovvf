using SO115App.Models.Classi.Condivise;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti
{
    public interface IGetListaDistaccamentiByCodiceSede
    {
        public List<Distaccamento> GetListaDistaccamenti(string CodSede);
    }
}
