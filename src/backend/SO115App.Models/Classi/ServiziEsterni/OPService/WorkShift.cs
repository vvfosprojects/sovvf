using MongoDB.Bson.Serialization.Attributes;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;

namespace SO115App.Models.Classi.ServiziEsterni.OPService
{
    public class WorkShift
    {
        public WorkShift()
        {
            Precedente = new SquadraWorkShift();
            Successivo = new SquadraWorkShift();
            Attuale = new SquadraWorkShift();
        }

        [BsonElement("Id")]
        public string Id { get; set; }

        [JsonPropertyName("previous")]
        public SquadraWorkShift Precedente { get; set; }

        [JsonPropertyName("next")]
        public SquadraWorkShift Successivo { get; set; }

        [JsonPropertyName("current")]
        public SquadraWorkShift Attuale { get; set; }

        [JsonIgnore()]
        public Squadra[] Squadre => new List<Squadra[]> { Attuale?.Squadre ?? new Squadra[] { }, Precedente?.Squadre ?? new Squadra[] { }, Successivo?.Squadre ?? new Squadra[] { } }
            .SelectMany(l => l)
            .GroupBy(s => s?.Codice)
            .Select(s => s?.FirstOrDefault())
            .ToArray();

        [JsonIgnore()]
        public Officer[] Funzionari => new List<Officer[]> { Attuale?.Funzionari ?? new Officer[] { }, Precedente?.Funzionari ?? new Officer[] { }, Successivo?.Funzionari ?? new Officer[] { } }
            .SelectMany(l => l)
            .GroupBy(s => s.CodiceFiscale)
            .Select(s => s.First())
            .ToArray();
    }

    public class SquadraWorkShift
    {
        public SquadraWorkShift()
        {
            Squadre = new Squadra[] { };
            Funzionari = new Officer[] { };
        }

        [JsonPropertyName("workshiftID")]
        public string Id { get; set; }

        [JsonPropertyName("spots")]
        public Squadra[] Squadre { get; set; }

        [JsonPropertyName("officers")]
        public Officer[] Funzionari { get; set; }
    }

    public class Officer
    {
        [JsonPropertyName("userId")]
        public string CodiceFiscale { get; set; }

        [JsonPropertyName("type")]
        public string Ruolo { get; set; }

        [JsonPropertyName("jobTitleCode")]
        public string JobTitleCode { get; set; }

        [JsonPropertyName("firstName")]
        public string Nome { get; set; }

        [JsonPropertyName("lastName")]
        public string Cognome { get; set; }
    }
}
