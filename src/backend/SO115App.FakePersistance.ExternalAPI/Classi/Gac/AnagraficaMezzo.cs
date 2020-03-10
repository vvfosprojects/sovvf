using System;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json;

namespace SO115App.ExternalAPI.Fake.Classi.Gac
{
    public class AnagraficaMezzo
    {
        /// <summary>
        ///   la classe che mappa i dati in arrivo dal servizio UtentiComuni
        /// </summary>
        [JsonConstructor]
        public AnagraficaMezzo(string targa, string tipoMezzo, GenereMezzo genereMezzo, SedeMezzo sede)
        {
            this.Targa = targa;
            this.TipoMezzo = tipoMezzo;
            this.GenereMezzo = genereMezzo;
            this.Sede = sede;
        }

        public string Targa { get; set; }

        public string TipoMezzo { get; set; }

        public GenereMezzo GenereMezzo { get; set; }

        public SedeMezzo Sede { get; set; }
    }
}
