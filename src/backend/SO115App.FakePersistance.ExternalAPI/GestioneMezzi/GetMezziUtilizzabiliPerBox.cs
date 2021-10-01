using Microsoft.Extensions.Configuration;
using SO115App.ExternalAPI.Client;
using SO115App.ExternalAPI.Fake.Classi;
using SO115App.ExternalAPI.Fake.Servizi.Gac;
using SO115App.Models.Classi.ServiziEsterni.Gac;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Gac;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.GestioneMezzi
{
    public class GetMezziUtilizzabiliPerBox : IGetMezziUtilizzabiliPerBox
    {
        private readonly IGetToken _getToken;
        private readonly IGetStatoMezzi _getStatoMezzi;
        private readonly IConfiguration _configuration;
        private readonly IHttpRequestManager<List<MezzoDTO>> _clientMezzi;

        public GetMezziUtilizzabiliPerBox(IConfiguration configuration, IGetStatoMezzi GetStatoMezzi,
            IGetToken getToken, IHttpRequestManager<List<MezzoDTO>> clientMezzi)
        {
            _getStatoMezzi = GetStatoMezzi;
            _clientMezzi = clientMezzi;
            _getToken = getToken;
            _configuration = configuration;
        }

        public async Task<Dictionary<string, string>> Get(string[] CodiciSedi)
        {
            var lstStatiMezzi = Task.Run(() => _getStatoMezzi.Get(CodiciSedi));

            var token = _getToken.GeneraToken();

            _clientMezzi.SetCache("Mezzi_" + CodiciSedi);

            var lstSediQueryString = string.Join("&codiciSedi=", CodiciSedi.Select(sede => sede.Split('.')[0]).Distinct().ToArray());
            var url = new Uri($"{_configuration.GetSection("UrlExternalApi").GetSection("GacApi").Value}{Costanti.GacGetMezziUtilizzabili}?codiciSedi={lstSediQueryString}");

            var lstMezzi = _clientMezzi.GetAsync(url, token).Result;

            var result = lstMezzi?.Select(mezzo => 
            new KeyValuePair<string, string>(mezzo.CodiceMezzo, lstStatiMezzi.Result.FirstOrDefault(stato => stato.CodiceMezzo.Equals(mezzo.CodiceMezzo))?.StatoOperativo ?? Costanti.MezzoInSede))
                .Distinct()
                .ToDictionary(mezzo => mezzo.Key, mezzo => mezzo.Value);

            return result;
        }
    }
}
