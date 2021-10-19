using System.Text.Json.Serialization;

namespace SO115App.Models.Classi.ServiziEsterni.UtenteComune
{
    /// <summary>
    ///   l'ogetto che mappa il distaccamento in arrivo dal servizio Utente Comune
    /// </summary>
    public class DistaccamentoUC
    {
        /// <summary>
        ///   l'id del distacamento composto dalla provincia e dal codice distaccamento es.: RM.1000
        /// </summary>
        [JsonPropertyName("id")]
        public string Id { get; set; }

        /// <summary>
        ///   il codice del distaccamento
        /// </summary>
        public string CodDistaccamento { get; set; }

        /// <summary>
        ///   il tipo di distaccamento
        /// </summary>
        [JsonPropertyName("codDistaccamento")]
        public string Tipo { get; set; }

        /// <summary>
        ///   la provincia del distaccamento
        /// </summary>
        [JsonPropertyName("provincia")]
        public string Provincia { get; set; }

        /// <summary>
        ///   l'id della sede padre
        /// </summary>
        [JsonPropertyName("idSedePadre")]
        public string IdSedePadre { get; set; }

        /// <summary>
        ///   l'indirizzo del distaccamento
        /// </summary>
        [JsonPropertyName("indirizzo")]
        public string Indirizzo { get; set; }

        /// <summary>
        ///   il cap del distaccamento
        /// </summary>
        [JsonPropertyName("cap")]
        public string Cap { get; set; }

        /// <summary>
        ///   il comune del distaccamento
        /// </summary>
        [JsonPropertyName("comune")]
        public string Comune { get; set; }

        /// <summary>
        ///   la descrizione del distaccamento
        /// </summary>
        [JsonPropertyName("descrizione")]
        public string Descrizione { get; set; }
    }
}
