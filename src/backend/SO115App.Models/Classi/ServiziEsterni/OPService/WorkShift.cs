﻿using MongoDB.Bson.Serialization.Attributes;
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

        public string IdMongo { get; set; }

        //[BsonElement("Id")]
        //public string Id { get; set; }

        [BsonElement("distaccamento")]
        public string Distaccamento { get; set; }

        [JsonPropertyName("previous")]
        public SquadraWorkShift Precedente { get; set; }

        [JsonPropertyName("next")]
        public SquadraWorkShift Successivo { get; set; }

        [JsonPropertyName("current")]
        public SquadraWorkShift Attuale { get; set; }

        [JsonIgnore()]
        public SquadraOpService[] Squadre => new List<SquadraOpService[]> { Attuale?.Squadre ?? new SquadraOpService[] { }, Precedente?.Squadre ?? new SquadraOpService[] { }, Successivo?.Squadre ?? new SquadraOpService[] { } }
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
            Squadre = new SquadraOpService[] { };
            Funzionari = new Officer[] { };
        }

        //[JsonPropertyName("workshiftID")]
        //public string Id { get; set; }

        [JsonPropertyName("spots")]
        public SquadraOpService[] Squadre { get; set; }

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
