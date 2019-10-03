using SO115App.Models.Classi.Condivise;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Servizi.Infrastruttura.GeoFleet
{
    internal interface IGetPosizioneFromCodiceMezzo
    {
        List<CoordinateGeoFleet> GetPosizione(string codiceMezzo); //L'API GeoFleet ancora non si aspetta una lista di codici mezzo
    }
}
