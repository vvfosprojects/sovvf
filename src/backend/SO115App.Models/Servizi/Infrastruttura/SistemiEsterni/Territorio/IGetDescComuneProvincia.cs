using SO115App.Models.Classi.ServiziEsterni.UtenteComune;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Territorio
{
    public interface IGetDescComuneProvincia
    {
        Task<List<ComuneUC>> GetComuneBy(string searchKey);
    }
}
