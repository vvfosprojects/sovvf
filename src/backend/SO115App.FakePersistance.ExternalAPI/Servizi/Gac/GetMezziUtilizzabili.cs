using Microsoft.Extensions.Configuration;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Organigramma;
using SO115App.ExternalAPI.Client;
using SO115App.Models.Classi.ServiziEsterni;
using SO115App.Models.Classi.ServiziEsterni.Gac;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using SO115App.Models.Servizi.Infrastruttura.GeoFleet;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Gac;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.Servizi.Gac
{
    public class GetMezziUtilizzabili : IGetMezziUtilizzabili
    {
        private readonly IGetStatoMezzi _getStatoMezzi;
        private readonly IGetDistaccamentoByCodiceSedeUC _getDistaccamentoByCodiceSedeUC;
        private readonly IGetAlberaturaUnitaOperative _getAlberaturaUnitaOperative;
        private readonly IGetPosizioneFlotta _getPosizioneFlotta;
        private readonly IConfiguration _configuration;

        private readonly IGetToken _getToken;
        private readonly IHttpRequestManager<IEnumerable<MezzoDTO>> _clientMezzi;

        public GetMezziUtilizzabili(IHttpRequestManager<IEnumerable<MezzoDTO>> clientMezzi, IGetToken getToken, IConfiguration configuration, IGetStatoMezzi GetStatoMezzi,
            IGetDistaccamentoByCodiceSedeUC GetDistaccamentoByCodiceSedeUC,
            IGetAlberaturaUnitaOperative getAlberaturaUnitaOperative, IGetPosizioneFlotta getPosizioneFlotta)
        {
            _getStatoMezzi = GetStatoMezzi;
            _clientMezzi = clientMezzi;
            _configuration = configuration;
            _getToken = getToken;
            _getDistaccamentoByCodiceSedeUC = GetDistaccamentoByCodiceSedeUC;
            _getAlberaturaUnitaOperative = getAlberaturaUnitaOperative;
            _getPosizioneFlotta = getPosizioneFlotta;
        }

        public async Task<List<Mezzo>> Get(List<string> sedi, string genereMezzo = null, string codiceMezzo = null, List<MessaggioPosizione> posizioneFlotta = null)
        {
            var pinNodi = sedi.Select(s => new PinNodo(s, true));
            var ListaCodiciComandi = new List<string>();
            var ListaCodiciSedi = new List<string>();
            var listaSediAlberate = _getAlberaturaUnitaOperative.ListaSediAlberata();

            foreach (var figlio in listaSediAlberate.GetSottoAlbero(pinNodi))
            {
                var codice = figlio.Codice;
                string codiceE = "";
                codiceE = ListaCodiciSedi.Find(x => x.Equals(codice));
                if (string.IsNullOrEmpty(codiceE))
                {
                    if (!ListaCodiciComandi.Contains(codice.Split('.')[0]))
                        ListaCodiciComandi.Add(codice.Split('.')[0]);
                    ListaCodiciSedi.Add(codice);
                }
            }

            var ListaPosizioneFlotta = new List<MessaggioPosizione>();
            if (posizioneFlotta == null)
                ListaPosizioneFlotta = _getPosizioneFlotta.Get(0).Result;
            else
                ListaPosizioneFlotta = posizioneFlotta;

            //var ListaAnagraficaMezzo = GetAnagraficaMezziByCodComando(ListaCodiciComandi).Result;

            #region LEGGO DA API ESTERNA

            var token = _getToken.GeneraToken();

            var lstMezziDto = new ConcurrentQueue<MezzoDTO>();

            var lstSediQueryString = string.Join("&codiciSedi=", sedi.Select(s => s.Split('.')[0]).Distinct().ToArray());
            var url = new Uri($"{_configuration.GetSection("UrlExternalApi").GetSection("GacApi").Value}{Classi.Costanti.GacGetMezziUtilizzabili}?codiciSedi={lstSediQueryString}");

            try
            {
                var resultApi = _clientMezzi.GetAsync(url, token);

                foreach (var personale in resultApi.Result)
                    lstMezziDto.Enqueue(personale);
            }
            catch (Exception e)
            {
                throw new Exception($"Elenco dei mezzi non disponibile: {e.GetBaseException()}");
            }

            #endregion LEGGO DA API ESTERNA

            //MAPPING
            var ListaMezzi = lstMezziDto.Select(m =>
            {
                //if (!mezzoFake.Equals("CMOB"))
                //{
                //var anagraficaMezzo = ListaAnagraficaMezzo.Find(x => x.Targa.Equals(m.Descrizione));
                var mezzo = MapMezzo(m);

                if (mezzo != null)
                {
                    //listaMezziBySedeAppo.Add(mezzo);
                    return mezzo;
                }
                //}

                var CoordinateMezzoGeoFleet = ListaPosizioneFlotta.Find(x => x.CodiceMezzo.Equals(mezzo.Codice));

                if (CoordinateMezzoGeoFleet == null)
                {
                    mezzo.Coordinate = mezzo.Distaccamento.Coordinate;
                    mezzo.CoordinateFake = true;
                }
                else
                {
                    mezzo.Coordinate = new Coordinate(CoordinateMezzoGeoFleet.Localizzazione.Lat, CoordinateMezzoGeoFleet.Localizzazione.Lon);
                    mezzo.CoordinateFake = false;
                }

                var ListaStatoOperativoMezzo = _getStatoMezzi.Get(mezzo.Distaccamento.Codice, mezzo.Codice);
                if (ListaStatoOperativoMezzo.Count > 0)
                {
                    mezzo.Stato = ListaStatoOperativoMezzo.Find(x => x.CodiceMezzo.Equals(mezzo.Codice)).StatoOperativo;
                    mezzo.IdRichiesta = ListaStatoOperativoMezzo.FirstOrDefault(x => x.CodiceMezzo.Equals(mezzo.Codice)).CodiceRichiesta;
                }

                return mezzo;
            }).ToList();

            return ListaMezzi;
        }

        private Mezzo MapMezzo(MezzoDTO mezzoDto)
        {
            var coordinate = new Coordinate(0, 0);
            //bool CoordinateFake = false;

            var distaccamento = _getDistaccamentoByCodiceSedeUC.Get(mezzoDto.CodiceDistaccamento).Result;

            var sede = new Sede(mezzoDto.CodiceDistaccamento,
                                distaccamento != null ? distaccamento.DescDistaccamento : "",
                                distaccamento != null ? distaccamento.Indirizzo : "",
                                distaccamento != null ? distaccamento.Coordinate : null,
                                "", "", "", "", "");

            var mezzo = new Mezzo(mezzoDto.CodiceMezzo,
                mezzoDto.Descrizione,
                mezzoDto.Genere,
                Costanti.MezzoInSede,
               mezzoDto.CodiceDistaccamento, sede, coordinate)
            {
                DescrizioneAppartenenza = mezzoDto.DescrizioneAppartenenza,
            };
            return mezzo;
        }

        private string GetStatoOperativoMezzo(string codiceSedeDistaccamento, string codiceMezzo, string StatoMezzoOra)
        {
            string stato;
            if (StatoMezzoOra.Equals("I"))
            {
                stato = Costanti.MezzoSulPosto;
            }
            else
            {
                var ListaStatoOperativoMezzo = _getStatoMezzi.Get(codiceSedeDistaccamento, codiceMezzo);
                if (ListaStatoOperativoMezzo.Count == 0)
                {
                    switch (StatoMezzoOra)
                    {
                        case "D": stato = Costanti.MezzoInSede; break;
                        case "R": stato = Costanti.MezzoInRientro; break;
                        case "S": stato = Costanti.MezzoOccupato; break;
                        case "O": stato = Costanti.MezzoOperativoPreaccoppiato; break;
                        case "A": stato = Costanti.MezzoAssegnatoPreaccoppiato; break;
                        default: stato = Costanti.MezzoStatoSconosciuto; break;
                    }
                }
                else
                {
                    stato = ListaStatoOperativoMezzo.Find(x => x.CodiceMezzo.Equals(codiceMezzo)).StatoOperativo;
                }
            }
            return stato;
        }

        public async Task<List<MezzoDTO>> GetInfo(List<string> codiciMezzi)
        {
            var token = _getToken.GeneraToken();

            var lstMezziDto = new ConcurrentQueue<MezzoDTO>();

            _clientMezzi.SetCache("Mezzi_" + codiciMezzi);

            string queryString = string.Join("&codiciMezzo=", codiciMezzi.ToArray());
            var url = new Uri($"{_configuration.GetSection("UrlExternalApi").GetSection("GacApi").Value}{Classi.Costanti.GacGetCodiceMezzo}?codiciMezzo={queryString}");

            var resultApi = _clientMezzi.GetAsync(url, token);

            resultApi.Result?.ToList().ForEach(personale => lstMezziDto.Enqueue(personale));

            return lstMezziDto.ToList();
        }

        public async Task<List<Mezzo>> GetBySedi(List<string> sedi, string genereMezzo = null, string codiceMezzo = null, List<MessaggioPosizione> posizioneFlotta = null)
        {
            var pinNodi = sedi.Select(s => new PinNodo(s, true));
            var ListaCodiciComandi = new List<string>();
            var ListaCodiciSedi = new List<string>();
            var listaSediAlberate = _getAlberaturaUnitaOperative.ListaSediAlberata();

            foreach (var figlio in listaSediAlberate.GetSottoAlbero(pinNodi))
            {
                var codice = figlio.Codice;
                string codiceE = "";
                codiceE = ListaCodiciSedi.Find(x => x.Equals(codice));
                if (string.IsNullOrEmpty(codiceE))
                {
                    if (!ListaCodiciComandi.Contains(codice.Split('.')[0]))
                        ListaCodiciComandi.Add(codice.Split('.')[0]);
                    ListaCodiciSedi.Add(codice);
                }
            }

            #region LEGGO DA API ESTERNA

            var token = _getToken.GeneraToken();

            var lstMezziDto = new ConcurrentQueue<MezzoDTO>();

            var lstSediQueryString = string.Join("&codiciSedi=", sedi.Select(s => s.Split('.')[0]).Distinct().ToArray());
            var url = new Uri($"{_configuration.GetSection("UrlExternalApi").GetSection("GacApi").Value}{Classi.Costanti.GacGetMezziUtilizzabili}?codiciSedi={lstSediQueryString}");

            try
            {
                var resultApi = _clientMezzi.GetAsync(url, token);

                foreach (var personale in resultApi.Result)
                    lstMezziDto.Enqueue(personale);
            }
            catch (Exception e)
            {
                throw new Exception($"Elenco dei mezzi non disponibile: {e.GetBaseException()}");
            }

            #endregion LEGGO DA API ESTERNA

            //MAPPING
            var ListaMezzi = lstMezziDto.Select(m => MapMezzo(m)).ToList();

            return ListaMezzi;
        }
    }
}
