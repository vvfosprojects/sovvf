using System;
using SO115App.API.Models.Classi.Condivise;
using SO115App.Models.Classi.Condivise;

namespace SO115App.FakePersistence.JSon.Classi
{
    public class MezziFromGeoFleet
    {
        public string CodiceMezzo { get; set; }
        public CoordinateGeoFleet Localizzazione { get; set; }
        public DateTime IstanteAcquisizione { get; set; }
    }
}
