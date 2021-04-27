using Microsoft.Extensions.Configuration;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Organigramma;
using SO115App.ExternalAPI.Client;
using SO115App.ExternalAPI.Fake.Classi;
using SO115App.ExternalAPI.Fake.Servizi.Gac;
using SO115App.Models.Classi.ServiziEsterni.Gac;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using SO115App.Models.Servizi.Infrastruttura.GeoFleet;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Gac;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.GestioneMezzi
{
    public class GetMezziUtilizzabiliPerBox : IGetMezziUtilizzabiliPerBox
    {
        private readonly IGetStatoMezzi _getStatoMezzi;
        private readonly IGetAlberaturaUnitaOperative _getAlberaturaUnitaOperative;
        //private readonly IGetPosizioneFlotta _getPosizioneFlotta;

        private readonly IConfiguration _configuration;

        private readonly IGetToken _getToken;
        private readonly IHttpRequestManager<List<MezzoDTO>> _clientMezzi;

        public GetMezziUtilizzabiliPerBox(IConfiguration configuration, IGetStatoMezzi GetStatoMezzi,
            IGetAlberaturaUnitaOperative getAlberaturaUnitaOperative,
            /*IGetPosizioneFlotta getPosizioneFlotta,*/ IGetToken getToken, IHttpRequestManager<List<MezzoDTO>> clientMezzi)
        {
            _getStatoMezzi = GetStatoMezzi;
            _getAlberaturaUnitaOperative = getAlberaturaUnitaOperative;
            //_getPosizioneFlotta = getPosizioneFlotta;
            _clientMezzi = clientMezzi;
            _getToken = getToken;
            _configuration = configuration;
        }

        public async Task<List<Mezzo>> Get(List<string> sedi, string genereMezzo = null, string codiceMezzo = null)
        {
            var listaSediAlberate = _getAlberaturaUnitaOperative.ListaSediAlberata();
            var pinNodi = sedi.Select(sede => new PinNodo(sede, true)).ToList();

            var ListaCodiciSedi = new List<string>();
            var ListaCodiciComandi = new List<string>();

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

            var lstMezzi = new ConcurrentQueue<Mezzo>();

            Parallel.ForEach(sedi, sede =>
            {
                _clientMezzi.SetCache("Mezzi_" + sede);

                var lstSediQueryString = string.Join("&codiciSedi=", ListaCodiciSedi.Where(s => sede.Contains(s.Split(".")[0])).ToArray());
                var url = new Uri($"{_configuration.GetSection("UrlExternalApi").GetSection("GacApi").Value}{Costanti.GacGetMezziUtilizzabili}?codiciSedi={lstSediQueryString}");
                
                _clientMezzi.GetAsync(url, token).Result.ForEach(m => lstMezzi.Enqueue(MapMezzo(m)));
            });

            #endregion LEGGO DA API ESTERNA

            return lstMezzi.ToList();
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
