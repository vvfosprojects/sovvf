using SO115App.API.Models.Classi.Organigramma;
using SO115App.Models.Classi.Condivise;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti
{
    public interface IGetListaDistaccamentiByPinListaSedi
    {
        public List<Distaccamento> GetListaDistaccamenti(List<PinNodo> listaPin);
    }
}
