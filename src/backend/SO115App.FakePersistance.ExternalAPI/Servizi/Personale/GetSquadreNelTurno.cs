using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Utenti;
using SO115App.ExternalAPI.Fake.Classi;
using SO115App.ExternalAPI.Fake.Servizi.Personale.Mock;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Personale;
using System;
using System.Collections.Generic;
using System.Net.Http;

namespace SO115App.ExternalAPI.Fake.Personale
{
    public class GetSquadreNelTurno : IGetSquadreNelTurno
    {
        private readonly HttpClient _client;
        private readonly IConfiguration _configuration;

        public GetSquadreNelTurno(HttpClient client, IConfiguration configuration)
        {
            _client = client;
            this._configuration = configuration;
        }

        public List<Turno> SquadreNelTurno(string codiceSede, string codiceTurno)
        {
            try
            {
                List<Turno> listaSquadreTurno = new List<Turno>();
                SquadreNelTurnoService service = new SquadreNelTurnoService();
                ComponentiSquadreService componentiService = new ComponentiSquadreService();

                var SquadreNelTurno = service.GetListaSquadreNelTurno(codiceSede, codiceTurno);

                foreach (var turno in SquadreNelTurno)
                {
                    foreach (var squadra in turno.ListaSquadre)
                    {
                        squadra.Componenti = new List<Componente>();
                        squadra.Componenti = componentiService.GetListaComponentiSquadra(codiceSede, squadra.Codice, turno.Codice);
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
