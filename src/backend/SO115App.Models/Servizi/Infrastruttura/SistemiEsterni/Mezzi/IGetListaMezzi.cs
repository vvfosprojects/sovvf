using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using SO115App.API.Models.Classi.Condivise;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Mezzi
{
    public interface IGetListaMezzi
    {
        Task<List<Mezzo>> Get(string CodSede);
    }
}
