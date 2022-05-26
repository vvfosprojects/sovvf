using SO115App.API.Models.Classi.Condivise;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.Utility
{
    public static class ManagerSedi
    {
        public static async Task<List<Sede>> GetFigli(this IGetSedi getSedi, Distaccamento distaccamento)
        {
            return null;
        }

        public static async Task<Sede> GetPadre(this IGetSedi getSedi, Distaccamento distaccamento)
        {
            return null;
        }

        public static async Task<List<Sede>> GetRicorsività(this IGetSedi getSedi, Distaccamento distaccamento)
        {
            return null;
        }

        public static async Task<List<Sede>> GetFigliAndRicorsività(this IGetSedi getSedi, Distaccamento distaccamento)
        {
            return null;
        }
    }
}
