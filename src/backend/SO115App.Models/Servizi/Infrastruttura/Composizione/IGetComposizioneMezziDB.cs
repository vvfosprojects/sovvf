using SO115App.API.Models.Classi.Composizione;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.Infrastruttura.Composizione
{
    public interface IGetComposizioneMezziDB
    {
        List<ComposizioneMezzi> GetByCodiciSede(params string[] codiciSede);
        List<ComposizioneMezzi> GetByCodiciMezzo(params string[] codiciMezzo);
        List<ComposizioneMezzi> GetByCodiceMezzo(string codiceMezzo);
    }
}
