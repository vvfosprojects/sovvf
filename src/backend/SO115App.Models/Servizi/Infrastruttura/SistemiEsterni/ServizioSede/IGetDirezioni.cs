using SO115App.Models.Classi.ServiziEsterni.UtenteComune;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede
{
    public interface IGetDirezioni
    {
        Task<List<SedeUC>> GetDirezioniRegionali(string codSede = null);
        Task<List<SedeUC>> GetDirezioniProvinciali(string codSede = null);
        Task<List<SedeUC>> GetFigliDirezione(string codSede = null);
    }
}
