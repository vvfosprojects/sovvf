using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Servizi.CQRS.Mappers.RichiestaSuSintesi;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.ExternalAPI.Client;
using SO115App.Models.Classi.ServiziEsterni.Statri;
using SO115App.Models.Classi.Soccorso.Eventi.Statri;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Statri;
using System;
using System.Net.Http;

namespace SO115App.ExternalAPI.Fake.Servizi.STATRI
{
    public class SendSTATRIItem : ISendSTATRIItem
    {
        private readonly IConfiguration _config;
        private readonly IHttpRequestManager<ReturnMsg> _client;
        private readonly IMapperRichiestaSuSintesi _mapperRichiestaSuSintesi;
        private readonly IMapperSintesiInSchedeSO115 _mapperSintesiInSchedeSO115;
        private readonly IUpDateRichiestaAssistenza _upDateRichiestaAssistenza;

        public SendSTATRIItem(IConfiguration config, IHttpRequestManager<ReturnMsg> client,
                           IMapperRichiestaSuSintesi mapperRichiestaSuSintesi,
                           IMapperSintesiInSchedeSO115 mapperSintesiInSchedeSO115,
                           IUpDateRichiestaAssistenza upDateRichiestaAssistenza)
        {
            _client = client;
            _mapperRichiestaSuSintesi = mapperRichiestaSuSintesi;
            _mapperSintesiInSchedeSO115 = mapperSintesiInSchedeSO115;
            _upDateRichiestaAssistenza = upDateRichiestaAssistenza;
            _config = config;
        }

        public async void InvioRichiesta(RichiestaAssistenza richiesta)
        {
            var sintesi = _mapperRichiestaSuSintesi.Map(richiesta);
            var schede = _mapperSintesiInSchedeSO115.Map(sintesi);

            var json = JsonConvert.SerializeObject(schede);
            var content = new StringContent(json);

            var baseurl = new Uri(_config.GetSection("UrlExternalApi").GetSection("Statri").Value);

            string action;
            if (richiesta.InviatoSTATRI)
                action = "UpdateRichiesta";
            else
                action = "import";

            var url = new Uri(baseurl, action);
            var result = await _client.PostAsync(url, content);
            if (result != null)
            {
                richiesta.InviatoSTATRI = true;

                if (result.Successfull != null)
                {
                    foreach (var invio in result.Successfull)
                    {
                        new STATRI_InivioRichiesta(richiesta, DateTime.Now, richiesta.CodOperatore, $"La scheda numero {invio.NumeroScheda}/{invio.ProgressivoScheda} riguardante la richiesta {richiesta.CodRichiesta} è stata inviata a STATRI Web");
                    }
                }

                if (result.Failed != null)
                {
                    foreach (var invio in result.Failed)
                    {
                        new STATRI_InivioRichiesta(richiesta, DateTime.Now, richiesta.CodOperatore, $"L'invio della scheda numero {invio.NumeroScheda}/{invio.ProgressivoScheda} riguardante la richiesta {richiesta.CodRichiesta} non è andata a buon fine. Motivo:{invio.Failed}");
                    }
                }
                _upDateRichiestaAssistenza.UpDate(richiesta);
            }
            else
            {
                new STATRI_InivioRichiesta(richiesta, DateTime.Now, richiesta.CodOperatore, $"L'invio della richiesta a STATRI Web non è andata a buon fine. Contattare l'amministratore di sistema");
                _upDateRichiestaAssistenza.UpDate(richiesta);
            }
        }
    }
}
