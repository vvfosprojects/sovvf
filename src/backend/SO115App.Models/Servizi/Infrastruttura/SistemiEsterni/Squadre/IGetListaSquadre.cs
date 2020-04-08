using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using SO115App.API.Models.Classi.Condivise;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Squadre
{
    public interface IGetListaSquadre
    {
        Task<List<Squadra>> Get(List<string> sedi);
    }
}
