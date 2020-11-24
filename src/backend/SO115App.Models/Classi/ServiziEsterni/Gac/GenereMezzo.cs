using System;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json;

namespace SO115App.ExternalAPI.Fake.Classi.Gac
{
    /// <summary>
    ///   la classe che mappa i dati in arrivo dal servizio UtentiComuni . I Dati sono relativi al
    ///   GenereMezzo, incluso nella classe AnagraficaMezzo
    /// </summary>
    public class GenereMezzo
    {
        [JsonConstructor]
        public GenereMezzo(string codiceTipo, string codice, string descrizione)
        {
            this.CodiceTipo = codiceTipo;
            this.Codice = codice;
            this.Descrizione = descrizione;
        }

        public string CodiceTipo { get; set; }
        public string Codice { get; set; }
        public string Descrizione { get; set; }
    }
}
