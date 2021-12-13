using SO115App.API.Models.Classi.Composizione;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.Infrastruttura.Composizione
{
    public interface IGetComposizioneMezziDB
    {
        List<ComposizioneMezzi> Get();
    }
}
