using System;

namespace SO115App.FakePersistence.JSon.Classi
{
    public class MapperMezziFromGeoFleet
    {
        public string codiceMezzo { get; set; }
        public coordinate Localizzazione { get; set; }
        public string[] classiMezzo { get; set; }

        public SO115 infoSO115 { get; set; }
    }

    public class SO115
    {
        public string stato { get; set; }
        public string codiceIntervento { get; set; }
        public DateTime dataIntervento { get; set; }
    }

    public class coordinate
    {
        public string lat { get; set; }
        public string lon { get; set; }
    }
}
