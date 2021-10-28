using Microsoft.Extensions.Configuration;
using SO115App.API.Models.Classi.Organigramma;
using SO115App.ExternalAPI.Client;
using SO115App.Models.Classi.MongoDTO;
using SO115App.Models.Classi.ServiziEsterni.UtenteComune;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.Servizi.GestioneSedi
{
    public class GetSedi : IGetDirezioni, IGetSedi, IGetAlberaturaUnitaOperative
    {
        private readonly IHttpRequestManager<List<SedeUC>> _serviceDirezioni;
        private readonly IHttpRequestManager<DistaccamentoUC> _serviceSedi;
        private readonly IConfiguration _config;

        public GetSedi(IHttpRequestManager<List<SedeUC>> serviceDirezioni, IHttpRequestManager<DistaccamentoUC> serviceSedi, IConfiguration config)
        {
            _serviceDirezioni = serviceDirezioni;
            _serviceSedi = serviceSedi;
            _config = config;
        }

        public async Task<List<SedeUC>> GetDirezioniProvinciali(string codSede = null)
        {
            var baseurl = _config.GetSection("UrlExternalApi").GetValue<string>("InfoSedeApiUtenteComune");
            var url = new Uri(baseurl + "/GetComandiProvinciali" + "?codSede=" + codSede);

            _serviceDirezioni.SetCache(url.AbsoluteUri);

            var lstSediProvinciali = await _serviceDirezioni.GetAsync(url);

            return lstSediProvinciali;
        }

        public async Task<List<SedeUC>> GetDirezioniRegionali(string codSede = null)
        {
            var baseurl = _config.GetSection("UrlExternalApi").GetValue<string>("InfoSedeApiUtenteComune");
            var url = new Uri(baseurl + "/GetDirezioniRegionali" + "?codSede=" + codSede);

            _serviceDirezioni.SetCache(url.AbsoluteUri);

            var lstSediRegionali = await _serviceDirezioni.GetAsync(url);

            return lstSediRegionali;
        }

        public async Task<List<SedeUC>> GetFigliDirezione(string codSede = null)
        {
            var baseurl = _config.GetSection("UrlExternalApi").GetValue<string>("InfoSedeApiUtenteComune");
            var url = new Uri(baseurl + "/GetChildSede" + "?codSede=" + codSede);

            _serviceDirezioni.SetCache(url.AbsoluteUri);

            var lstFigli = await _serviceDirezioni.GetAsync(url);

            return lstFigli;
        }

        public DistaccamentoUC GetInfoSede(string codSede)
        {
            var baseurl = _config.GetSection("UrlExternalApi").GetValue<string>("InfoSedeApiUtenteComune");
            var url = new Uri(baseurl + "/GetInfoSede" + "?codSede=" + codSede);

            _serviceSedi.SetCache(url.AbsoluteUri);

            var sede = _serviceSedi.GetAsync(url).Result;

            return sede;
        }

        public List<ListaSedi> GetAll()
        {
            return ListaSediAlberata().Figli.Select(f => new ListaSedi() 
            { 
                attiva = 1,  
                idsede = int.Parse(f.Codice),
                sede = f.Nome                
            }).ToList();
        }

        public UnitaOperativa ListaSediAlberata()
        {
            //OTTENGO TUTTE LE SEDI, PER OGNI LIVELLO

            var lstRegionali = GetDirezioniRegionali();

            var lstProvinciali = GetDirezioniProvinciali();

            var lstFigli = Task.Run(() => lstProvinciali.Result.SelectMany(provinciale => GetFigliDirezione(provinciale.id).Result).ToList());

            var con = GetInfoSede("00");

            var conFiglio = GetInfoSede("001");
            

            //CREO L'ALNERATURA DELLE SEDI PARTENDO DAL CON
            var result = new UnitaOperativa(con.Id, con.Descrizione);
            result.AddFiglio(new UnitaOperativa(conFiglio.Id, conFiglio.Descrizione));

            //REGIONI
            foreach (var regionale in lstRegionali.Result)
            {
                result.Figli.First().AddFiglio(new UnitaOperativa(regionale.id, regionale.descrizione));
            }

            //PROVINCE
            Parallel.ForEach(lstProvinciali.Result, provinciale =>
            {
                var infoProvinciale = GetInfoSede(provinciale.id);

                var lstComunali = GetFigliDirezione(provinciale.id).Result
                    .Select(comunale => new UnitaOperativa(comunale.id, comunale.descrizione)).ToHashSet();

                var distaccamento = lstComunali.FirstOrDefault(c => c.Nome.ToLower().Contains("centrale"));

                result.Figli.First().Figli.FirstOrDefault(r => r.Codice?.Equals(infoProvinciale.IdSedePadre) ?? false)?
                    .AddFiglio(new UnitaOperativa(distaccamento?.Codice, provinciale?.descrizione) { Figli = lstComunali });
            });

            return result;
        }
    }
}
