using SO115App.API.Models.Classi.Condivise;

namespace SO115App.Models.Classi.ServiziEsterni.UtenteComune
{
    /// <summary>
    ///   oggetto della sede associata ad una persona fisica del personale in arrivo dal servizio
    ///   Utenti Comuni
    /// </summary>
    public class SedeUC
    {
        /// <summary>
        ///   l'id della sede.
        /// </summary>
        public string id { get; set; }

        /// <summary>
        ///   la descrizione della sede
        /// </summary>
        public string descrizione { get; set; }

        /// <summary>
        ///   Coordinate della sede
        /// </summary>
        public string coordinate
        {
            get; set;
            //get
            //{
            //    if (coordinate.Contains("°"))
            //        return DmsToDdString(coordinate);
            //    else
            //        return coordinate;
            //}
            //set
            //{
            //}
        }

        public Coordinate Coordinate
        {
            get
            {
                try
                {
                    if (coordinate != null)
                    {
                        if (coordinate.Contains(","))
                        {
                            if (!coordinate.Contains("°"))
                                return new Coordinate(double.Parse(coordinate.Split(',')[0].Replace(".", ",")), double.Parse(coordinate.Split(',')[1].Replace(".", ",")));
                            else
                                return DmsToDd(coordinate);
                        }
                        else
                            return new Coordinate();
                    }
                    else
                        return new Coordinate();
                }
                catch (System.Exception e)
                {
                    return new Coordinate();
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
        ///   Converte da "40°08'08.7\"N,8°48'48.8\"E" a 40.2425425454
        /// </summary>
        /// <param name="coordinate"></param>
        /// <returns></returns>
        public string DmsToDdString(string coordinate)
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

            return $"{ddLat.ToString()},{ddLon.ToString()}";
        }

        public string codice { get; set; }
        public string codDistaccamento { get; set; }
        public string tipo { get; set; }
        public string tipoOriginale { get; set; }
        public TipologiaDistaccamentoUC tipologiaDistaccamento { get; set; }
        public string provincia { get; set; }
    }

    public class TipologiaDistaccamentoUC
    {
        public string codice { get; set; }
        public string descrizione { get; set; }
    }
}
