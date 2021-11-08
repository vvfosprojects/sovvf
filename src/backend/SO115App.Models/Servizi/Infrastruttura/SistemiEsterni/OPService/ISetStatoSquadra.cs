using SO115App.Models.Classi.ServiziEsterni.OPService;
using System.Net.Http;
using System.Threading.Tasks;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.OPService
{
    public interface ISetStatoSquadra
    {
        public Task<HttpResponseMessage> SetStatoSquadraOPService(actionDTO action);
    }
}
