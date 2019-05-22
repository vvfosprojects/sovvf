using SO115App.API.Models.Classi.Boxes;

namespace SO115App.Models.Servizi.Infrastruttura.Box
{
    public interface IGetBoxRichieste
    {
        /// <summary>
        ///   Restituisce i dati riguardanti gli Interventi, da posizionare nel Box in Home Page
        /// </summary>
        /// <returns>Il numero totale dei Squadre</returns>
        BoxInterventi Get();
    }
}
