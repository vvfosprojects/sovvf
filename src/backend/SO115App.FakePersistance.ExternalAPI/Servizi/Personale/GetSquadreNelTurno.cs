using Newtonsoft.Json;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Utenti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Personale;
using System;
using System.Collections.Generic;
using System.Net.Http;

namespace SO115App.ExternalAPI.Fake.Personale
{
    public class GetSquadreNelTurno : IGetSquadreNelTurno
    {
        private readonly HttpClient _client;

        public GetSquadreNelTurno(HttpClient client)
        {
            _client = client;
        }

        public List<Turno> SquadreNelTurno(string codiceSede, string codiceTurno)
        {
            try
            {
                List<Turno> listaSquadreTurno = new List<Turno>();
                var response = _client.GetStringAsync(string.Format(Costanti.ServiziGetSquadreUrl + "/GetSquadreNelTurno/codiceSede={0}&codiceTurno={1}", codiceSede, codiceTurno));
                foreach (var turno in JsonConvert.DeserializeObject<List<Turno>>(response.ToString()))
                {
                    foreach (var squadra in turno.ListaSquadre)
                    {
                        squadra.Componenti = new List<Componente>();
                        var responseComponenti = _client.GetStringAsync(string.Format(Costanti.ServiziGetSquadreUrl + "/codiceSede={0}&codiceSquadra={1}&codiceTurno={2}", codiceSede, squadra.Codice, turno.Codice));
                        squadra.Componenti = JsonConvert.DeserializeObject<List<Componente>>(responseComponenti.ToString());
                    }
                    listaSquadreTurno.Add(turno);
                }
                return listaSquadreTurno;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
    }
}
