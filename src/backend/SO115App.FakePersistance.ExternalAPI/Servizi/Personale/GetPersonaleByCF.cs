using Microsoft.Extensions.Configuration;
using SO115App.Models.Classi.Utenti.Autenticazione;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Personale;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.Servizi.Personale
{
    /// <summary>
    ///   classe che estende l'interfaccia e recupera la persona fisica partendo dal codice fiscale
    ///   su Utenti Comuni
    /// </summary>
    public class GetPersonaleByCF : IGetPersonaleByCF
    {
        private readonly Client.IHttpRequestManager<IEnumerable<PersonaleVVF>> _clientPersonale;
        private readonly IConfiguration _configuration;

        public GetPersonaleByCF(Client.IHttpRequestManager<IEnumerable<PersonaleVVF>> client, IConfiguration configuration)
        {
            _clientPersonale = client;
            _configuration = configuration;
        }

        public async Task<PersonaleVVF> Get(string codiceFiscale, string codSede = null)
        {
            if (codSede != null)
                return GetPersonaleVVFExternalAPI(new string[] { codSede }).Result.FirstOrDefault(x => x.codiceFiscale.Equals(codiceFiscale));
            else
                return GetPersonaleVVFExternalAPIByCF(new string[] { codiceFiscale }).Result.FirstOrDefault(x => x.codiceFiscale.Equals(codiceFiscale));
        }

        public async Task<IEnumerable<PersonaleVVF>> Get(string[] codiceFiscale, string[] codSede = null)
        {
            if (codSede != null)
                return GetPersonaleVVFExternalAPI(codSede).Result;
            else
                return GetPersonaleVVFExternalAPIByCF(codiceFiscale).Result;
        }

        private async Task<IEnumerable<PersonaleVVF>> GetPersonaleVVFExternalAPI(string[] codSede)
        {
            var listaPersonale = new ConcurrentQueue<PersonaleVVF>();

            Parallel.ForEach(codSede, sede =>
            {
                _clientPersonale.SetCache("Personale_" + sede);

                var url = new Uri($"{_configuration.GetSection("UrlExternalApi").GetSection("PersonaleApiUtenteComuni").Value}?codiciSede={sede}");

                try
                {
                    var resultApi = _clientPersonale.GetAsync(url);

                    foreach (var personale in resultApi.Result)
                        listaPersonale.Enqueue(personale);
                }
                catch (Exception e)
                {
                    throw new Exception($"Elenco del personale non disponibile: {e.GetBaseException()}");
                }
            });

            return listaPersonale;
        }

        private async Task<IEnumerable<PersonaleVVF>> GetPersonaleVVFExternalAPIByCF(string[] CodFiscale)
        {
            var listaPersonale = new ConcurrentQueue<PersonaleVVF>();


            _clientPersonale.SetCache("Personale_" + String.Join(",",CodFiscale));

            var url = new Uri($"{_configuration.GetSection("UrlExternalApi").GetSection("PersonaleApiUtenteComuni").Value}?codiciFiscali={String.Join(",", CodFiscale)}");

            try
            {
                var resultApi = _clientPersonale.GetAsync(url);

                foreach (var personale in resultApi.Result)
                    listaPersonale.Enqueue(personale);
            }
            catch (Exception e)
            {
                throw new Exception($"Elenco del personale non disponibile: {e.GetBaseException()}");
            }


            return listaPersonale;
        }
    }
}
