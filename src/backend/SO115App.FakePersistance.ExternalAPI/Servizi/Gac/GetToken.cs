using Microsoft.Extensions.Configuration;
using SO115App.ExternalAPI.Client;
using SO115App.ExternalAPI.Fake.Classi;
using SO115App.Models.Classi.ServiziEsterni.Gac;
using System;

namespace SO115App.ExternalAPI.Fake.Servizi.Gac
{
    public class GetToken : IGetToken
    {
        private readonly IConfiguration _configuration;
        private readonly IHttpRequestManager<TokenService> _clientToken;

        public GetToken(IHttpRequestManager<TokenService> clientToken, IConfiguration configuration)
        {
            _clientToken = clientToken;
            _configuration = configuration;
        }

        public string GeneraToken()
        {
            string token = "so115";

            //var url = new Uri($"{_configuration.GetSection("UrlExternalApi").GetSection("GacApi").Value}{Costanti.GacGetToken}?user=SO115&password=SO115");
            //var EsitoToken = _clientToken.GetAsync(url, token).Result;

            //if (!EsitoToken.errore)
            //    token = EsitoToken.descrizioneEsito;

            return token;
        }
    }

    public interface IGetToken
    {
        public string GeneraToken();
    }
}
