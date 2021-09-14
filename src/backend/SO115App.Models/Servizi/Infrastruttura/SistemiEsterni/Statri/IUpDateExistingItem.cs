using SO115App.Models.Classi.ServiziEsterni.Statri;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Statri
{
    public interface IUpDateExistingItem
    {
        public Task<List<ReturnMsg>> UpdateRichiesta(List<SchedaSO115> schede);
    }
}
