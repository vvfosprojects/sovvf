using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using SO115App.API.Models.Classi.Composizione;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.GesPreaccoppiati
{
    public interface IGetListaGesPreaccoppiati
    {
        Task<List<PreAccoppiati>> Get(string CodSede);
    }
}
