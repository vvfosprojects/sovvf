using SO115App.API.Models.Classi.Organigramma;
using SO115App.Models.Classi.Condivise;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti
{
    public interface IGetListaDistaccamentiByPinListaSedi
    {
        public List<Distaccamento> GetListaDistaccamenti(List<PinNodo> listaPin = null);
    }
}
