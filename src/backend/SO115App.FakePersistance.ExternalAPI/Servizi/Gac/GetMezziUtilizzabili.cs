using Microsoft.Extensions.Configuration;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Organigramma;
using SO115App.ExternalAPI.Client;
using SO115App.ExternalAPI.Fake.Composizione;
using SO115App.Models.Classi.ServiziEsterni;
using SO115App.Models.Classi.ServiziEsterni.Gac;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using SO115App.Models.Servizi.Infrastruttura.GeoFleet;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.GestioneTipologie;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ESRI;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Gac;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Mezzi;
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
        private readonly IGetAlberaturaUnitaOperative _getAlberaturaUnitaOperative;
        private readonly IGetPosizioneFlotta _getPosizioneFlotta;
        private readonly IGetStringCoordinateByCodSede _getStringCoordinateByCodSede;
        private readonly IConfiguration _configuration;

        private readonly IGetComposizioneMezziDB _getComposizioneMezziDB;

        private readonly IGetToken _getToken;
        private readonly IHttpRequestManager<IEnumerable<MezzoDTO>> _clientMezzi;

        public GetMezziUtilizzabili(IHttpRequestManager<IEnumerable<MezzoDTO>> clientMezzi, IGetToken getToken, 
            IConfiguration configuration, IGetStatoMezzi GetStatoMezzi, IGetAlberaturaUnitaOperative getAlberaturaUnitaOperative, 
            IGetPosizioneFlotta getPosizioneFlotta, IGetStringCoordinateByCodSede getStringCoordinateByCodSede,
            IGetDistanzaTempoMezzi getDistanzaTempo, IGetTipologieByCodice getTipologieByCodice, IGetComposizioneMezziDB getComposizioneMezziDB)
        {
            _getStatoMezzi = GetStatoMezzi;
            _clientMezzi = clientMezzi;
            _configuration = configuration;
            _getToken = getToken;
            _getAlberaturaUnitaOperative = getAlberaturaUnitaOperative;
            _getPosizioneFlotta = getPosizioneFlotta;
            _getStringCoordinateByCodSede = getStringCoordinateByCodSede;
            _getComposizioneMezziDB = getComposizioneMezziDB;
        }

        public async Task<List<Mezzo>> Get(List<string> sedi, string genereMezzo = null, string codiceMezzo = null, List<MessaggioPosizione> posizioneFlotta = null)
        {
            var pinNodi = sedi.Select(s => new PinNodo(s, true));
            var ListaCodiciComandi = new List<string>();
            var ListaCodiciSedi = new List<string>();
            Task<List<MessaggioPosizione>> ListaPosizioneFlotta = null;

            var listaSediAlberate = _getAlberaturaUnitaOperative.ListaSediAlberata();

            if (posizioneFlotta == null)
                ListaPosizioneFlotta = _getPosizioneFlotta.Get(0);

            foreach (var figlio in listaSediAlberate.Result.GetSottoAlbero(pinNodi))
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
                var resultApi = await _clientMezzi.GetAsync(url, token);

                if (!(resultApi?.Any()) ?? true)
                    return new List<Mezzo>();

                foreach (var personale in resultApi)
                    lstMezziDto.Enqueue(personale);
            }
            catch (Exception e)
            {
                var lstMezzi = _getComposizioneMezziDB.GetByCodiciMezzo();

                var result = lstMezzi.Select(s => s.Mezzo).ToList();

                return result;
            }

            #endregion LEGGO DA API ESTERNA

            var lstSedi = GetListaSediMezzi(lstMezziDto.ToList(), ListaPosizioneFlotta.Result, listaSediAlberate.Result).ToList();

            //MAPPING
            var ListaMezzi = lstMezziDto.Select(m =>
            {
                var mezzo = MapMezzo(m, ListaPosizioneFlotta.Result, listaSediAlberate.Result, lstSedi);

                if (mezzo != null)
                {
                    var CoordinateMezzoGeoFleet = ListaPosizioneFlotta == null ?
                        posizioneFlotta.Find(x => x.CodiceMezzo.Equals(mezzo.Codice)) :
                        ListaPosizioneFlotta.Result.Find(x => x.CodiceMezzo.Equals(mezzo.Codice));

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
                }
                else return null;

            }).ToList();

            return ListaMezzi;
        }

        public async Task<List<MezzoDTO>> GetInfo(List<string> codiciMezzi)
        {
            var token = _getToken.GeneraToken();

            var lstMezziDto = new List<MezzoDTO>();

            try
            {
                string queryString = string.Join("&codiciMezzo=", codiciMezzi.ToArray());
                var url = new Uri($"{_configuration.GetSection("UrlExternalApi").GetSection("GacApi").Value}{Classi.Costanti.GacGetCodiceMezzo}?codiciMezzo={queryString}");

                var resultApi = await _clientMezzi.GetAsync(url, token);

                resultApi?.ToList().ForEach(personale => lstMezziDto.Add(personale));

                return lstMezziDto;
            }
            catch (Exception)
            {
                var lstMezzi = _getComposizioneMezziDB.GetByCodiciMezzo(codiciMezzi.ToArray());

                var result = lstMezzi.Select(s => new MezzoDTO()
                {
                    Appartenenza = s.Mezzo.Distaccamento.Codice,
                    CodiceDistaccamento = s.Mezzo.Appartenenza,
                    CodiceMezzo = s.Mezzo.Codice,
                    Descrizione = s.Mezzo.Descrizione,
                    DescrizioneAppartenenza = s.Mezzo.Distaccamento.Descrizione,
                    Genere = s.Mezzo.Genere
                }).ToList();

                return result;
            }
        }

        public async Task<List<Mezzo>> GetBySedi(string[] sedi)
        {
            var lstSediQueryString = string.Join("&codiciSedi=", sedi.Select(s => s.Split('.')[0]).Distinct());
            var url = new Uri($"{_configuration.GetSection("UrlExternalApi").GetSection("GacApi").Value}{Classi.Costanti.GacGetMezziUtilizzabili}?codiciSedi={lstSediQueryString}");
            var codici = string.Join(", ", sedi.Select(s => s.Split('.')[0]).Distinct());

            var ListaPosizioneFlotta = _getPosizioneFlotta.Get(0);
            var listaSediAlberate = _getAlberaturaUnitaOperative.ListaSediAlberata();

            var lstMezziDto = new List<MezzoDTO>();

            try
            {
                var token = _getToken.GeneraToken();

                var data = _clientMezzi.GetAsync(url, token).Result;

                lstMezziDto.AddRange(data);
            }
            catch (Exception e)
            {
                throw new Exception($"Elenco dei mezzi non disponibile: {e.GetBaseException()}");
            }

            var lstSedi = GetListaSediMezzi(lstMezziDto, ListaPosizioneFlotta.Result, listaSediAlberate.Result).ToList();

            //MAPPING
            var ListaMezzi = lstMezziDto
                .Select(m => MapMezzo(m, ListaPosizioneFlotta.Result, listaSediAlberate.Result, lstSedi))
                .ToList();

            return ListaMezzi;
        }

        private IEnumerable<Sede> GetListaSediMezzi(List<MezzoDTO> lstMezzi, List<MessaggioPosizione> flotta, UnitaOperativa listaSediAlberate)
        {
            var lstCodSedi = new List<string>();

            foreach (var mezzoDto in lstMezzi)
            {
                var pinNodi = new List<PinNodo>();
                pinNodi.Add(new PinNodo(mezzoDto.CodiceDistaccamento, true));

                string descSede = "";
                string IndirizzoSede = "";
                Coordinate coordinate = null;
                string[] coordinateStrg = new string[2];

                var CoordinateMezzoGeoFleet = flotta.Find(x => x.CodiceMezzo.Equals(mezzoDto.CodiceMezzo));

                if (CoordinateMezzoGeoFleet != null)
                {
                    coordinate = new Coordinate(CoordinateMezzoGeoFleet.Localizzazione.Lat, CoordinateMezzoGeoFleet.Localizzazione.Lon);
                    coordinateStrg = new string[2] { coordinate.Latitudine.ToString(), coordinate.Longitudine.ToString() };
                }

                if (!lstCodSedi.Contains(mezzoDto.CodiceDistaccamento))
                {
                    foreach (var figlio in listaSediAlberate.GetSottoAlbero(pinNodi))
                    {
                        if (figlio.Codice.Equals(mezzoDto.CodiceDistaccamento))
                        {
                            descSede = figlio.Nome;

                            if (coordinate == null)
                            {
                                coordinateStrg = _getStringCoordinateByCodSede.Get(figlio.Codice);

                                if (coordinateStrg != null)
                                    coordinate = new Coordinate(Convert.ToDouble(coordinateStrg[0].Replace(".", ",")), Convert.ToDouble(coordinateStrg[1].Replace(".", ",")));
                                else
                                    coordinateStrg = new string[] { "0", "0" };
                            }
                        }
                    }
                }

                if(!lstCodSedi.Contains(mezzoDto.CodiceDistaccamento))
                {
                    lstCodSedi.Add(mezzoDto.CodiceDistaccamento);

                    yield return new Sede(mezzoDto.CodiceDistaccamento, descSede ?? "", IndirizzoSede ?? "", coordinate ?? null)
                    {
                        CoordinateString = _getStringCoordinateByCodSede.Get(mezzoDto.CodiceDistaccamento)
                    };
                }
            }
        }

        private Mezzo MapMezzo(MezzoDTO mezzoDto, List<MessaggioPosizione> ListaPosizioneFlotta, UnitaOperativa listaSediAlberate, List<Sede> lstSedi)
        {
            if (ListaPosizioneFlotta == null)
                ListaPosizioneFlotta = _getPosizioneFlotta.Get(0).Result;

            if (listaSediAlberate == null)
                listaSediAlberate = _getAlberaturaUnitaOperative.ListaSediAlberata().Result;

            try
            {
                var sede = lstSedi.FirstOrDefault(s => s.Codice.Equals(mezzoDto.CodiceDistaccamento));

                var posizioneMezzo = ListaPosizioneFlotta.FirstOrDefault(p => p.CodiceMezzo.Equals(mezzoDto.CodiceMezzo));

                var coordinate = posizioneMezzo == null ? sede.Coordinate : posizioneMezzo.ToCoordinate();
                var coordinateStrg = posizioneMezzo == null ? sede.CoordinateString : new string[2] { coordinate.Latitudine.ToString(), coordinate.Longitudine.ToString() };

                return new Mezzo()
                {
                    DescrizioneAppartenenza = mezzoDto.DescrizioneAppartenenza,
                    CoordinateStrg = coordinateStrg ?? sede.CoordinateString,
                    Codice = mezzoDto.CodiceMezzo,
                    Descrizione = mezzoDto.Descrizione,
                    Genere = mezzoDto.Genere,
                    Stato = Costanti.MezzoInSede,
                    Appartenenza = mezzoDto.CodiceDistaccamento,
                    Distaccamento = sede,
                    Coordinate = new Coordinate(coordinate?.Latitudine ?? 0, coordinate?.Longitudine ?? 0)
                };
            }
            catch (Exception e)
            {
                throw new Exception("Errore mapping mezzi.");
            }
        }
    }
}
