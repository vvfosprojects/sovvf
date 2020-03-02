using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using SO115App.ExternalAPI.Fake.Classi.DTOOracle;
using SO115App.ExternalAPI.Fake.Classi.Utility;
using SO115App.Models.Classi.Utenti.Autenticazione;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Personale;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.ImportOracle.GestioniUtenti
{
    public class GetPersonaleVVF : IGetPersonaleVVF
    {
        private readonly HttpClient _client;
        private readonly IConfiguration _configuration;
        private readonly IGetPersonaleByCodSede _getListaPersonale;

        public GetPersonaleVVF(IGetPersonaleByCodSede getListaPersonale)
        {
            _getListaPersonale = getListaPersonale;
        }

        public async Task<List<PersonaleVVF>> Get(string text, string codSede)
        {
            return _getListaPersonale.Get(codSede).Result.FindAll(x => x.Nominativo.Contains(text));
        }
    }
}
