using SO115App.API.Models.Classi.Condivise;
using System;

namespace SO115App.Models.Classi.ServiziEsterni
{
    public class MessaggioPosizione
    {
        public string CodiceMezzo { get; set; }
        public Localizzazione Localizzazione { get; set; }
        public DateTime IstanteAcquisizione { get; set; }

        public Coordinate ToCoordinate()
        {
            if (Localizzazione != null && Localizzazione.Lon != null && Localizzazione.Lat != null)
                return new Coordinate(Localizzazione.Lat, Localizzazione.Lon);
            else
                return null;
        }
    }
}
