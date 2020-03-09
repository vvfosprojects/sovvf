using SO115App.Models.Classi.Condivise;
using System.Threading.Tasks;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti
{
    /// <summary>
    ///   servizio che recupera da un servizio esterno un distaccamento a partire dal codiceSede
    /// </summary>
    public interface IGetDistaccamentoByCodiceSedeUC
    {
        /// <summary>
        ///   metodo dell'interfaccia che restituisce un task con l'oggetto distaccamento
        /// </summary>
        /// <param name="codiceSede">il codice sede</param>
        /// <returns>il distaccamento</returns>
        public Task<Distaccamento> Get(string codiceSede);
    }
}
