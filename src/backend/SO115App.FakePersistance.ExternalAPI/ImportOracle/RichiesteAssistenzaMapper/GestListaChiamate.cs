using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Classi.Soccorso.Eventi;
using SO115App.API.Models.Classi.Soccorso.Eventi.Segnalazioni;
using SO115App.API.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestrioneIntervento.Shared.AddIntervento;
using SO115App.ExternalAPI.Fake.Classi.DTOOracle;

namespace SO115App.ExternalAPI.Fake.ImportOracle.ChiamateMapper
{
    public class GestListaChiamate
    {
        private readonly HttpClient _client;
        private readonly IConfiguration _configuration;

        public GestListaChiamate(HttpClient client, IConfiguration configuration)
        {
            _client = client;
            _configuration = configuration;
        }

        public async Task<List<RichiestaAssistenza>> Get(string CodSede)
        {
            _client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("test");
            var response = await _client.GetAsync($"{_configuration.GetSection("OracleImplementation").GetSection(CodSede).GetSection("UrlAPIRichieste").Value}/GetListaChiamate?CodSede={CodSede}").ConfigureAwait(false);
            response.EnsureSuccessStatusCode();
            using HttpContent content = response.Content;
            var ListaChiamateOracle = await content.ReadAsAsync<List<ORAChiamate>>().ConfigureAwait(false);
            return MapListaChiamateOraInMongoDB(ListaChiamateOracle);
        }

        private List<RichiestaAssistenza> MapListaChiamateOraInMongoDB(List<ORAChiamate> ListaChiamateOracle)
        {
            List<RichiestaAssistenza> ListaRichiestaAssistenza = new List<RichiestaAssistenza>();

            foreach (ORAChiamate OraC in ListaChiamateOracle)
            {
                var prioritaRichiesta = (RichiestaAssistenza.Priorita)OraC.COD_PRIORITA;

                string[] CodUOCompetenzaAppo = { OraC.COMANDO }; //_ToDo inserire anche il codice_distaccamento

                List<string> UtInLavorazione = new List<string>();
                UtInLavorazione.Add(OraC.MATRICOLA_OPERATORE_CHIAMATA);
                var c = new Coordinate(OraC.X, OraC.Y);
                var richiesta = new RichiestaAssistenza()
                {
                    Codice = OraC.CHIAMATA.ToString(),
                    Richiedente = new Richiedente(OraC.TELE_NUMERO, OraC.TELE_NUMERO),
                    Localita = new Localita(c, OraC.DESC_LUOGO, ""),
                    Descrizione = "",
                    TipoTerreno = null,
                    ObiettivoSensibile = null,
                    UtInLavorazione = UtInLavorazione,

                    CodUOCompetenza = CodUOCompetenzaAppo
                };

                new Telefonata(richiesta, OraC.TELE_NUMERO, DateTime.UtcNow, OraC.MATRICOLA_OPERATORE_CHIAMATA)
                {
                    NominativoChiamante = OraC.RICHIEDENTE,
                    Motivazione = "",
                    NumeroTelefono = OraC.TELE_NUMERO,
                    Esito = Azione.MettiInCoda.ToString(),
                };

                new AssegnazionePriorita(richiesta, prioritaRichiesta, DateTime.UtcNow.AddMilliseconds(1.0), OraC.MATRICOLA_OPERATORE_CHIAMATA);
                ListaRichiestaAssistenza.Add(richiesta);
            }
            return ListaRichiestaAssistenza;
        }
    }
}
