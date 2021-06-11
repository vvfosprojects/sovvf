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
        public string[] CodiciMezziPreaccoppiati { get; set; }

        [JsonPropertyName("spotMembers")]
        public Membro[] Membri { get; set; }

        [JsonPropertyName("enabled")]
        public bool Attiva { get; set; }
    }

    public class Membro
    {
        [JsonPropertyName("userId")]
        public string CodiceFiscale { get; set; }
        
        [JsonPropertyName("role")]
        public string Ruolo { get; set; }

        //[JsonPropertyName("presences")]
        //public Presenza[] Presenze { get; set; }
    }

    //public class Presenza
    //{
    //    [JsonPropertyName("from")]
    //    public DateTime Da { get; set; }

    //    [JsonPropertyName("to")]
    //    public DateTime A { get; set; }
    //}
}



//"id": "60bdde7a49b4ee70cf546392",
//"spotId": "b2a70906-d35f-4135-a380-532c6b7a1fc0",
//"code": "1/A",
//"description": "Prima partenza centrale",
//"shift": "A",
//"venueId": "RM.1000",
//"operationState": "AVAILABLE",
//"vehiclesIds": null,
//"spotMembers": [
//  {
//    "userId": "PPRPLA66E04H501A",
//    "role": "TEAM_LEADER",
//    "presences": [
//      {
//        "from": "2021-06-07T06:00:00Z",
//        "to": "2021-06-07T18:00:00Z"
//      }
//    ]
//  }
//],
//"spotType": "WORKSHIFT",
//"start": "2021-06-07T06:00:00Z",
//"end": "2021-06-07T18:00:00Z",
//"version": 1,
//"createdAt": "2021-06-07T08:53:14.628Z",
//"enabled": true,
//"dne": "DIURNO",
//"workshiftId": "60bddbea49b4ee70cf54633f",
//"workshiftVenueId": "RM",
//"workshiftFrom": "2021-06-07T06:00:00Z",
//"workshiftTo": "2021-06-07T18:00:00Z",
//"workshiftShifts": [
//  "A"
//]