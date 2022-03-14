using SO115App.API.Models.Classi.Composizione;
using SO115App.API.Models.Classi.Soccorso;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Mezzi
{
    public interface IOrdinamentoMezzi
    {
        Task<List<ComposizioneMezzi>> GetIndiceOrdinamento(RichiestaAssistenza Richiesta, List<ComposizioneMezzi> composizioni);
    }
}
