using System;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json;

namespace SO115App.ExternalAPI.Fake.Classi.Gac
{
    /// <summary>
    ///   la classe che mappa i dati in arrivo dal servizio UtentiComuni . I Dati sono relativi al
    ///   SedeMezzo, incluso nella classe AnagraficaMezzo
    /// </summary>
    public class SedeMezzo
    {
        [JsonConstructor]
        public SedeMezzo(string id, string codDistaccamento, string codice, string descrizione)
        {
            this.Id = id;
            this.CodDistaccamento = codDistaccamento;
            this.Codice = codice;
            this.Descrizione = descrizione;
        }

        public string Id { get; set; }
        public string CodDistaccamento { get; set; }
        public string Codice { get; set; }
        public string Descrizione { get; set; }
    }
}
