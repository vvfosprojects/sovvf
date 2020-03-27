using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.ExternalAPI.Fake.Classi.Gac
{
    public class FineMovimentazioneDTO
    {
        /// <summary>
        ///   Id della richiesta a cui è stato associato il mezzo
        /// </summary>
        [JsonProperty(PropertyName = "idRichiesta")]
        public string IdRichiesta { get; set; }

        /// <summary>
        ///   identificativo del mezzo
        /// </summary>
        [JsonProperty(PropertyName = "codiceMezzo")]
        public string CodiceMezzo { get; set; }

        /// <summary>
        ///   indica la data in cui è stata associato il mezzo e il suo stato alla richiesta
        /// </summary>
        [JsonProperty(PropertyName = "dataMovimentazione")]
        public DateTime? DataMovimentazione { get; set; }
    }
}
