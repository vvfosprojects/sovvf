using SO115App.API.Models.Classi.Condivise;
using System;
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

        [JsonPropertyName("coordinate")]
        public string coordinate { get; set; }

        public Coordinate Coordinate
        {
            get
            {
                if (string.IsNullOrEmpty(coordinate))
                    return new Coordinate();
                else
                {
                    try
                    {
                        var coord = new Coordinate(double.Parse(coordinate.Split(',')[0].Replace('.', ',')), double.Parse(coordinate.Split(',')[1].Replace('.', ',')))
                        {
                            CoordToString = coordinate.Split(',')
                        };

                        return coord;
                    }
                    catch
                    {
                        return DmsToDd(coordinate);
                    }
                }
            }
        }

        /// <summary>
        ///   Converte da "40°08'08.7\"N,8°48'48.8\"E" a 40.2425425454
        /// </summary>
        /// <param name="coordinate"></param>
        /// <returns></returns>
        private Coordinate DmsToDd(string coordinate)
        {
            string lat = coordinate.Split(',')[0];
            string lon = coordinate.Split(',')[1];

            double ddLat = double.Parse(lat.Split('°')[0]) + (double.Parse(lat.Split("'")[0].Split('°')[1]) / 60) + (double.Parse(lat.Split("'")[1].Split("\"")[0]) / 3600);
            double ddLon = double.Parse(lon.Split('°')[0]) + (double.Parse(lon.Split("'")[0].Split('°')[1]) / 60) + (double.Parse(lon.Split("'")[1].Split("\"")[0]) / 3600);

            if (lat.Contains('W') || lat.Contains('S'))
            {
                ddLat *= -1;
            }

            if (lon.Contains('W') || lon.Contains('S'))
            {
                ddLon *= -1;
            }

            return new Coordinate(ddLat, ddLon);
        }

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
        ///   la descrizione del distaccamento
        /// </summary>
        [JsonPropertyName("descrizione")]
        public string Descrizione { get; set; }
    }
}
