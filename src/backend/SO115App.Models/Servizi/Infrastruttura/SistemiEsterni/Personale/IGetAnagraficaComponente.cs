using SO115App.Models.Classi.ServiziEsterni.IdentityManagement;
using System.Threading.Tasks;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Personale
{
    public interface IGetAnagraficaComponente
    {
        public Task<DatiComponente> GetByCodFiscale(string CodFiscale);
    }
}
