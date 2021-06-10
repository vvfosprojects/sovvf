using Microsoft.Extensions.Configuration;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Organigramma;
using SO115App.ExternalAPI.Client;
using SO115App.ExternalAPI.Fake.Classi;
using SO115App.Models.Classi.Composizione;
using SO115App.Models.Classi.ServiziEsterni.OPService;
using SO115App.Models.Servizi.Infrastruttura.GestioneStatoOperativoSquadra;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.OPService;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static SO115App.API.Models.Classi.Condivise.Squadra;
using Squadra = SO115App.Models.Classi.ServiziEsterni.OPService.Squadra;

namespace SO115App.ExternalAPI.Fake.Servizi.OPService
{
    public class GetAllSquadre : IGetAllSquadre
    {
        private readonly IHttpRequestManager<List<Squadra>> _service;
        private readonly IConfiguration _config;
        private readonly IGetStatoSquadra _getStatoSquadre;
        private readonly IGetAlberaturaUnitaOperative _getAlberaturaUnitaOperative;
        private readonly IGetListaDistaccamentiByPinListaSedi _getDistaccamenti;

        public GetAllSquadre(IHttpRequestManager<List<Squadra>> service,
            IConfiguration config, IGetStatoSquadra getStatoSquadre,
            IGetAlberaturaUnitaOperative getAlberaturaUnitaOperative,
            IGetListaDistaccamentiByPinListaSedi getDistaccamenti)
        {
            _service = service;
            _config = config;
            _getStatoSquadre = getStatoSquadre;
            _getAlberaturaUnitaOperative = getAlberaturaUnitaOperative;
            _getDistaccamenti = getDistaccamenti;
        }

        public List<SquadraComposizione> GetByCodiceSede(string[] CodiciSede)
        {
            var baseurl = new Uri(_config.GetSection("UrlExternalApi").GetSection("OPService").Value);

            List<SquadraComposizione> lstSquadre = new List<SquadraComposizione>();

            foreach (string codice in CodiciSede)
            {
                var url = new Uri(baseurl, "api/v1/so-workshift/" + "?id_sede=" + codice);
                var result = Task.Run(() => _service.GetAsync(url));
                lstSquadre.AddRange(MappaOPSquadreSuSOSquadre(result, codice));
            }

            return lstSquadre;
        }

        private List<SquadraComposizione> MappaOPSquadreSuSOSquadre(Task<List<Squadra>> lstOPSquadre, string codice)
        {
            List<string> listaSedi = new List<string>();
            listaSedi.Add(codice);

            var lstSquadre = new ConcurrentBag<SquadraComposizione>();

            var lstStatiSquadre = Task.Run(() => _getStatoSquadre.Get(listaSedi));

            var lstDistaccamenti = Task.Run(() =>
            {
                var listaSediAlberate = _getAlberaturaUnitaOperative.ListaSediAlberata();
                var pinNodi = new List<PinNodo>();
                foreach (var sede in listaSedi)
                    pinNodi.Add(new PinNodo(sede, true));

                foreach (var figlio in listaSediAlberate.GetSottoAlbero(pinNodi))
                    pinNodi.Add(new PinNodo(figlio.Codice, true));

                var result = _getDistaccamenti.GetListaDistaccamenti(pinNodi.ToHashSet().ToList());

                return result;
            });

            Parallel.ForEach(lstOPSquadre.Result, squadra => lstSquadre.Add(new SquadraComposizione()
            {
                Id = squadra.Id,
                Stato = lstStatiSquadre.Result.Find(statosquadra => statosquadra.IdSquadra.Equals(squadra.Codice))?.StatoSquadra ?? Costanti.MezzoInSede,
                Codice = squadra.Codice,
                Turno = squadra.TurnoAttuale,
                Nome = squadra.Descrizione,
                Distaccamento = lstDistaccamenti.Result.Find(d => d.Id.Contains(squadra.Distaccamento))?.DescDistaccamento,
                DataInServizio = DateTime.MinValue,
                Componenti = null
            }
            ));

            return lstSquadre.ToList();
        }
    }
}
