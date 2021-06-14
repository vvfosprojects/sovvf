using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace SO115App.Models.Classi.ServiziEsterni.IdentityManagement
{
    public class PersonaFisica
    {
        [JsonPropertyName("dati")]
        public List<DatiComponente> Dati { get; set; }
    }

    public class DatiComponente
    {
        [JsonPropertyName("cognome")]
        public string Cognome { get; set; }

        [JsonPropertyName("nome")]
        public string Nome { get; set; }

        [JsonPropertyName("dtNascita")]
        public string DtNascita { get; set; }

        [JsonPropertyName("sesso")]
        public string Sesso { get; set; }

        [JsonPropertyName("provincia")]
        public string CodProvincia { get; set; }

        [JsonPropertyName("comune")]
        public string CodComune { get; set; }

        [JsonPropertyName("codFiscale")]
        public string CodFiscale { get; set; }
    }
}
