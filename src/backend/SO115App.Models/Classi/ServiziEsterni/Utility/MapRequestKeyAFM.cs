using System;

namespace SO115App.Models.Classi.ServiziEsterni.Utility
{
    public static class MapRequestKeyAFM
    {
        public static string MapForAFM(string requestKey)
        {
            string value = requestKey;

            string sede = value.Split('-', StringSplitOptions.RemoveEmptyEntries)[0];
            string seq = value.Split('-', StringSplitOptions.RemoveEmptyEntries)[2].TrimStart('0');
            string data = value.Split('-', StringSplitOptions.RemoveEmptyEntries)[1];

            seq = seq == "" ? "0" : seq;

            var requestKeyResult = "CMD." + sede + '.' + seq + '.' + data;

            return requestKeyResult;
        }
    }
}
