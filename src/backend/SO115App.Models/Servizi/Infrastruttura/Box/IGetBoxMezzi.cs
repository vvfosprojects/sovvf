using SO115App.API.Models.Classi.Boxes;

namespace SO115App.Models.Servizi.Infrastruttura.Box
{
    public interface IGetBoxMezzi
    {
        /// <summary>
        ///   Restituisce i dati riguardanti i Mezzi, da posizionare nel Box in Home Page
        /// </summary>
        /// <returns>Il numero totale dei Squadre</returns>
        BoxMezzi Get();
    }
}
