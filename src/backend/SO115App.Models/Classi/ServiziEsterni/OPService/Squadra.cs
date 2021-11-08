using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace SO115App.Models.Classi.ServiziEsterni.OPService
{
    public class Squadra
    {
        [JsonPropertyName("id")]
        public string Id { get; set; }

        [JsonPropertyName("code")]
        public string Codice { get; set; }

        [JsonPropertyName("description")]
        public string Descrizione { get; set; }

        [JsonPropertyName("shift")]
        public string TurnoAttuale { get; set; }

        [JsonPropertyName("venueId")]
        public string Distaccamento { get; set; }

        [JsonPropertyName("operationState")]
        public string Stato { get; set; }

        [JsonPropertyName("vehiclesIds")]
        public string[]? CodiciMezziPreaccoppiati { get; set; }

        [JsonPropertyName("spotMembers")]
        public Membro[] Membri { get; set; }

        [JsonPropertyName("enabled")]
        public bool Attiva { get; set; }

        [JsonPropertyName("spotId")]
        public string spotId { get; set; }

        [JsonPropertyName("spotType")]
        public string spotType { get; set; }

        [JsonPropertyName("version")]
        public int version { get; set; }

        [JsonPropertyName("workshiftId")]
        public string workshiftId { get; set; }

        [JsonPropertyName("dne")]
        private string dne { get; set; }

        public bool Emergenza => dne == "EMERGENZA";
    }

    public class Membro
    {
        [JsonPropertyName("userId")]
        public string CodiceFiscale { get; set; }

        [JsonPropertyName("role")]
        public string Ruolo { get; set; }

        [JsonPropertyName("firstName")]
        public string FirstName { get; set; }

        [JsonPropertyName("lastName")]
        public string LastName { get; set; }

        [JsonPropertyName("qualifications")]
        public Qualifiche[] qualifications { get; set; }
    }

    public class Qualifiche
    {
        [JsonPropertyName("name")]
        public string name { get; set; }

        [JsonPropertyName("description")]
        public string description { get; set; }

        [JsonPropertyName("group")]
        public string group { get; set; }
    }
}
