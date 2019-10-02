using SO115App.API.Models.Classi.Condivise;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Gac
{
    internal interface IGetMezziFromId
    {
        List<Mezzo> GetMezziFromID(List<string> codiceMezzo);
    }
}
