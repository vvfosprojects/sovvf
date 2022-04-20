using System.Collections.Generic;

namespace SO115App.Models.Classi.Utenti.Autenticazione
{
    /// <summary>
    ///   classe che mappa il personale in arrivo da oracle o dai servizi esterni
    /// </summary>
    public class AnagraficaPersonaleVVF
    {
        public string codiceFiscale { get; set; }
        public string nome { get; set; }
        public string cognome { get; set; }
        public string sesso { get; set; }
        public InfoNascita nascita { get; set; }
        public InfoResidenza residenza { get; set; }
        public InfoDomicilio domicilio { get; set; }
        public string[] contatti { get; set; }
        public InfoSede sede { get; set; }
    }

    public class InfoSede
    {
        public string id { get; set; }
        public string codice { get; set; }
        public string codDistaccamento { get; set; }
        public string descrizione { get; set; }
    }

    public class InfoDomicilio
    {
        public string indirizzo { get; set; }
        public string cap { get; set; }
        public string comune { get; set; }
        public string provincia { get; set; }
    }

    public class InfoResidenza
    {
        public string indirizzo { get; set; }
        public string cap { get; set; }
        public string comune { get; set; }
        public string provincia { get; set; }
    }

    public class InfoNascita
    {
        public string data { get; set; }
        public string comune { get; set; }
        public string provincia { get; set; }
    }
}
