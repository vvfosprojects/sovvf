using SO115App.API.Models.Classi.Boxes;

namespace SO115App.Models.Servizi.Infrastruttura.Box
{
    public interface IGetBoxPersonale
    {
        /// <summary>
        ///   Restituisce i dati riguardanti il Personale, da posizionare nel Box in Home Page
        /// </summary>
        /// <returns>Il numero totale dei Squadre</returns>
        BoxPersonale Get();
    }
}
