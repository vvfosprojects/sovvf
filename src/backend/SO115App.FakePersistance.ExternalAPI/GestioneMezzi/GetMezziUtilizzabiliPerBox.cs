using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Organigramma;
using SO115App.ExternalAPI.Fake.Classi;
using SO115App.ExternalAPI.Fake.Classi.Gac;
using SO115App.ExternalAPI.Fake.HttpManager;
using SO115App.Models.Classi.ServiziEsterni.Gac;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using SO115App.Models.Servizi.Infrastruttura.GeoFleet;
using SO115App.Models.Servizi.Infrastruttura.GestioneLog;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Gac;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.GestioneMezzi
{
    public class GetMezziUtilizzabiliPerBox : BaseService, IGetMezziUtilizzabiliPerBox
    {
        private readonly IGetStatoMezzi _getStatoMezzi;
        private readonly IGetAlberaturaUnitaOperative _getAlberaturaUnitaOperative;
        private readonly IGetPosizioneFlotta _getPosizioneFlotta;

        public GetMezziUtilizzabiliPerBox(HttpClient client, IConfiguration configuration, IGetStatoMezzi GetStatoMezzi,
            IGetAlberaturaUnitaOperative getAlberaturaUnitaOperative,
            IMemoryCache memoryCache, IGetPosizioneFlotta getPosizioneFlotta, IWriteLog writeLog, IHttpContextAccessor httpContext)
            : base(client, configuration, memoryCache, writeLog, httpContext)
        {
            _getStatoMezzi = GetStatoMezzi;
            _getAlberaturaUnitaOperative = getAlberaturaUnitaOperative;
            _getPosizioneFlotta = getPosizioneFlotta;
        }

        public async Task<List<Mezzo>> Get(List<string> sedi, string genereMezzo = null, string codiceMezzo = null)
        {
            var ListaCodiciSedi = new List<string>();
            var ListaCodiciComandi = new List<string>();

            var listaSediAlberate = _getAlberaturaUnitaOperative.ListaSediAlberata();
            var pinNodi = sedi.Select(sede => new PinNodo(sede, true)).ToList();

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

            var ListaAnagraficaMezzo = new List<AnagraficaMezzo>();
            var ListaPosizioneFlotta = _getPosizioneFlotta.Get(0).Result;


            #region LEGGO DA API ESTERNA

            var lstMezziDto = new List<MezzoDTO>();
            Parallel.ForEach(sedi, sede =>
            {
                var httpManager = new HttpRequestManager<List<MezzoDTO>>(_client, _memoryCache, _writeLog, _httpContext);
                httpManager.Configure("Mezzi_" + sede);

                var lstSediQueryString = string.Join("&codiciSedi=", ListaCodiciSedi.Where(s => sede.Contains(s.Split(".")[0])).ToArray());
                var url = new Uri($"{_configuration.GetSection("UrlExternalApi").GetSection("GacApi").Value}{Costanti.GacGetMezziUtilizzabili}?codiciSedi={lstSediQueryString}");
                lock (lstMezziDto)
                    lstMezziDto.AddRange(httpManager.GetAsync(url).Result);
            });

            #endregion LEGGO DA API ESTERNA

            var ListaStatiOperativiMezzi = _getStatoMezzi.Get(sedi.ToArray());

            var ListaMezzi = lstMezziDto.Select(m =>
            {
                //if (!mezzoFake.Equals("CMOB"))
                //{
                var mezzo = MapMezzo(m);
                if (mezzo != null)
                {
                    //listaMezziBySedeAppo.Add(mezzo);
                    return mezzo;
                }
                //}


                if (ListaStatiOperativiMezzi.Count > 0)
                    mezzo.Stato = ListaStatiOperativiMezzi.Find(x => x.CodiceMezzo.Equals(mezzo.Codice)).StatoOperativo;
                else
                    mezzo.Stato = Costanti.MezzoInSede;

                return mezzo;
            }).ToList();

            return ListaMezzi;
        }

        private Mezzo MapMezzo(MezzoDTO mezzoDto)
        {
            var coordinate = new Coordinate(0, 0);

            var sede = new Sede(mezzoDto.CodiceDistaccamento, null, null, null, "", "", "", "", "");

            var mezzo = new Mezzo(mezzoDto.CodiceMezzo, mezzoDto.Descrizione, mezzoDto.Genere,
                GetStatoOperativoMezzo(mezzoDto.CodiceDistaccamento, mezzoDto.CodiceMezzo, mezzoDto.Movimentazione.StatoOperativo),
                mezzoDto.CodiceDistaccamento, sede, coordinate)
            {
                DescrizioneAppartenenza = mezzoDto.DescrizioneAppartenenza,
            };

            return mezzo;
        }

        private string GetStatoOperativoMezzo(string codiceSedeDistaccamento, string codiceMezzo, string StatoMezzoOra)
        {
            string stato;
            //if (StatoMezzoOra.Equals("I"))
            //{
            //    stato = Models.Classi.Utility.Costanti.MezzoSulPosto;
            //}
            //else
            //{
            var ListaStatoOperativoMezzo = _getStatoMezzi.Get(codiceSedeDistaccamento, codiceMezzo);
                if (ListaStatoOperativoMezzo.Count == 0)
                {
                    switch (StatoMezzoOra)
                    {
                        case "D": stato = Models.Classi.Utility.Costanti.MezzoInSede; break;
                        case "R": stato = Models.Classi.Utility.Costanti.MezzoInRientro; break;
                        case "O": stato = Models.Classi.Utility.Costanti.MezzoOperativoPreaccoppiato; break;
                        case "A": stato = Models.Classi.Utility.Costanti.MezzoAssegnatoPreaccoppiato; break;
                        default: stato = Models.Classi.Utility.Costanti.MezzoStatoSconosciuto; break;
                    }
                }
                else
                {
                    stato = ListaStatoOperativoMezzo.Find(x => x.CodiceMezzo.Equals(codiceMezzo)).StatoOperativo;
                }
            //}
            return stato;
        }
    }
}
