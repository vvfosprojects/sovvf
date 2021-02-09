using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using SO115App.Models.Classi.ServiziEsterni.UtenteComune;
using SO115App.Models.Classi.ServiziEsterni.Utility;
using SO115App.Models.Classi.Utenti.Autenticazione;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Personale;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.Servizi.Personale
{
    /// <summary>
    ///   classe che estende l'interfaccia e recupera la persona fisica partendo dal codice fiscale
    ///   su Utenti Comuni
    /// </summary>
    public class GetPersonaleByCF : IGetPersonaleByCF
    {
        private readonly Client.IHttpRequestManager<List<PersonaleVVF>> _clientPersonale;
        private readonly IConfiguration _configuration;
        public GetPersonaleByCF(Client.IHttpRequestManager<List<PersonaleVVF>> client, IConfiguration configuration) 
        { 
            _clientPersonale = client;
            _configuration = configuration; 
        }

        public async Task<PersonaleVVF> Get(string codiceFiscale, string codSede = null)
        {
            if (codSede != null)
            {
                var ListaPersonaleVVF = GetPersonaleVVFExternalAPI(new string[] { codSede }).Result;
                return ListaPersonaleVVF.Find(x => x.codiceFiscale.Equals(codiceFiscale));
            }
            else
            {
                var Persona = GetPersonaleVVFExternalAPIByCF(new string[] { codiceFiscale }).Result;
                return Persona.Find(x => x.codiceFiscale.Equals(codiceFiscale));
            }
        }

        public async Task<List<PersonaleVVF>> Get(string[] codiceFiscale, string[] codSede = null)
        {
            if (codSede != null)
            {
                var lstPersonale = GetPersonaleVVFExternalAPI(codSede).Result;
                return lstPersonale.FindAll(c => codiceFiscale.Contains(c.codiceFiscale));
            }
            else
                return GetPersonaleVVFExternalAPIByCF(codiceFiscale).Result;
        }

        private async Task<List<PersonaleVVF>> GetPersonaleVVFExternalAPI(string[] codSede)
        {
            var listaPersonale = new List<PersonaleVVF>();

            try
            {
                Parallel.ForEach(codSede, sede =>
                {
                    _clientPersonale.Configure("Personale_" + sede);

                    var url = new Uri($"{_configuration.GetSection("UrlExternalApi").GetSection("PersonaleApiUtenteComuni").Value}?codiciSede={sede}");
                    lock (listaPersonale)
                        listaPersonale.AddRange(_clientPersonale.GetAsync(url, "").Result);
                });
            }
            catch (Exception e)
            {
                throw new Exception("Elenco del personale non disponibile");
            }

            return listaPersonale;
        }

        private async Task<List<PersonaleVVF>> GetPersonaleVVFExternalAPIByCF(string[] CodFiscale)
        {
            var result = new List<PersonaleVVF>();

            Parallel.ForEach(CodFiscale, codf =>
            {
                #region API ESTERNA

                var client = new HttpClient();
                client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("test");
                var response = client.GetAsync($"{_configuration.GetSection("UrlExternalApi").GetSection("PersonaleApiUtenteComuni").Value}?codiciFiscali={codf}").Result;
                response.EnsureSuccessStatusCode();
                using HttpContent content = response.Content;
                string data = content.ReadAsStringAsync().Result;
                var personaleUC = JsonConvert.DeserializeObject<List<PersonaleUC>>(data);
                var mapped = MapPersonaleVVFsuPersonaleUC.Map(personaleUC);

                #endregion API ESTERNA

                lock (new object()) { result.AddRange(mapped); }
            });

            return result.Where(s => s != null).ToList();
        }
    }
}
