using SO115App.Models.Classi.ServiziEsterni;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.Infrastruttura.GeoFleet
{
    public interface IGetPosizioneByCodiceMezzo
    {
        MessaggioPosizione Get(string codiceMezzo); //L'API GeoFleet ancora non si aspetta una lista di codici mezzo
    }
}
