using SO115App.API.Models.Classi.Composizione;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.PreAccoppiati;
using SO115App.Models.Classi.Composizione;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Classi.ServiziEsterni;
using SO115App.Models.Classi.ServiziEsterni.Gac;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using SO115App.Models.Servizi.Infrastruttura.GeoFleet;
using SO115App.Models.Servizi.Infrastruttura.GestioneStatoOperativoSquadra;
using SO115App.Models.Servizi.Infrastruttura.GetPreAccoppiati;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Gac;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.OPService;
using SO115App.Models.Servizi.Infrastruttura.Turni;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.Servizi.Preaccoppiati
{
    public class GetPreAccoppiati : IGetPreAccoppiati
    {
        private readonly IGetSquadre _getSquadre;
        private readonly IGetMezziUtilizzabili _getMezzi;
        private readonly IGetStatoMezzi _getStatoMezzi;
        private readonly IGetStatoSquadra _getStatoSquadre;
        private readonly IGetTurno _getTurno;
        private readonly IGetPosizioneFlotta _getPosizioneFlotta;
        private readonly IGetDistaccamentoByCodiceSedeUC _getDistaccamentoByCodiceSedeUC;

        private List<MessaggioPosizione> pFlotta = new List<MessaggioPosizione>();

        public GetPreAccoppiati(IGetDistaccamentoByCodiceSedeUC getDistaccamentoByCodiceSedeUC, IGetSquadre getSquadre, IGetMezziUtilizzabili getMezzi,
                                IGetStatoMezzi getStatoMezzi, IGetStatoSquadra getStatoSquadre, IGetTurno getTurno,
                                IGetPosizioneFlotta getPosizioneFlotta)
        {
            _getSquadre = getSquadre;
            _getMezzi = getMezzi;
            _getStatoMezzi = getStatoMezzi;
            _getStatoSquadre = getStatoSquadre;
            _getTurno = getTurno;
            _getPosizioneFlotta = getPosizioneFlotta;
            _getDistaccamentoByCodiceSedeUC = getDistaccamentoByCodiceSedeUC;

            pFlotta = _getPosizioneFlotta.Get(0).Result;
        }

        public async Task<List<PreAccoppiato>> GetAsync(PreAccoppiatiQuery query)
        {
            Task<List<MezzoDTO>> lstMezzi = null;
            var lstStatoMezzi = Task.Run(() => _getStatoMezzi.Get(query.CodiceSede));
            var lstStatoSquadre = Task.Run(() => _getStatoSquadre.Get(_getTurno.Get().Codice, query.CodiceSede.ToList()));

            var lstSquadreWS = query.CodiceSede.Select(sede => _getSquadre.GetAllByCodiceDistaccamento(sede.Split('.')[0]).Result).ToList();

            var lstSquadre = new List<Models.Classi.ServiziEsterni.OPService.Squadra>();
            if (lstSquadreWS[0] != null)
            {
                if (query.Filtri.Turno != null)
                {
                    if (query.Filtri.Turno.Equals("0"))
                        lstSquadre = lstSquadreWS.SelectMany(shift => shift?.Precedente.Squadre).ToList();
                    else if (query.Filtri.Turno.Equals("1"))
                        lstSquadre = lstSquadreWS.SelectMany(shift => shift?.Successivo.Squadre).ToList();
                    else
                        lstSquadre = lstSquadreWS.SelectMany(shift => shift?.Attuale.Squadre).ToList();
                }
                else
                    lstSquadre = lstSquadreWS.SelectMany(shift => shift?.Attuale.Squadre).ToList();

                if (lstSquadre.Count > 0)
                {
                    var lstSquadrePreaccoppiate = lstSquadre.Where(s => s.CodiciMezziPreaccoppiati != null && s.CodiciMezziPreaccoppiati.Count() > 0).ToList();

                    return await Task.Run(() => //OTTENGO I DATI
                    {
                        var lstSquadreMezzo = new ConcurrentDictionary<string, SO115App.API.Models.Classi.Composizione.Squadra[]>();

                        if (query.Filtri.CodiceDistaccamento != null)
                        {
                            Parallel.ForEach(query.CodiceSede, codice =>
                            {
                                lstSquadrePreaccoppiate.Where(s => !s.spotType.Equals("MODULE") && query.Filtri.CodiceDistaccamento.Any(x => x.Equals(s.Distaccamento))).ToList().ForEach(squadra => squadra.CodiciMezziPreaccoppiati?.ToList().ForEach(m =>
                                    lstSquadreMezzo.TryAdd(m, lstSquadre
                                        .Where(s => s.Codice.Equals(squadra.Codice))
                                        .Select(s => new SO115App.API.Models.Classi.Composizione.Squadra(s.Codice, s.Descrizione, MappaStatoSquadra(lstStatoSquadre, s.Codice), MapMembriInComponenti(s.Membri.ToList())))
                                        .ToArray())));
                            });
                        }
                        else
                        {
                            Parallel.ForEach(query.CodiceSede, codice =>
                            {
                                lstSquadrePreaccoppiate.Where(s => !s.spotType.Equals("MODULE")).ToList().ForEach(squadra => squadra.CodiciMezziPreaccoppiati?.ToList().ForEach(m =>
                                    lstSquadreMezzo.TryAdd(m, lstSquadre
                                        .Where(s => s.Codice.Equals(squadra.Codice))
                                        .Select(s => new SO115App.API.Models.Classi.Composizione.Squadra(s.Codice, s.Descrizione, MappaStatoSquadra(lstStatoSquadre, s.Codice), MapMembriInComponenti(s.Membri.ToList())))
                                        .ToArray())));
                            });
                        }

                        lstMezzi = _getMezzi.GetInfo(lstSquadreMezzo.Select(lst => lst.Key).ToList());

                        return lstSquadreMezzo;
                    })
                    .ContinueWith(lstMezziSquadra => lstMezziSquadra.Result.Select(squadreMezzo => //MAPPING
                    {
                        var MezzoSquadra = lstMezzi.Result.Find(mezzo => mezzo.CodiceMezzo.Equals(squadreMezzo.Key));

                        if (MezzoSquadra == null)
                            return new PreAccoppiato();

                        var DescSede = _getDistaccamentoByCodiceSedeUC.Get(MezzoSquadra.CodiceDistaccamento).Result;

                        return new PreAccoppiato()
                        {
                            Appartenenza = MezzoSquadra.CodiceDistaccamento,
                            Coordinate = GetCoordinateMezzo(MezzoSquadra.CodiceMezzo, DescSede),
                            CodiceMezzo = MezzoSquadra.CodiceMezzo,
                            Distaccamento = DescSede.DescDistaccamento.ToUpper(),
                            DescrizioneMezzo = MezzoSquadra.Descrizione,
                            GenereMezzo = MezzoSquadra.Genere,
                            StatoMezzo = lstStatoMezzi.Result.Find(m => m.CodiceMezzo.Equals(MezzoSquadra.CodiceMezzo))?.StatoOperativo ?? Costanti.MezzoInSede,
                            Squadre = lstMezziSquadra.Result.Where(s => s.Key.Equals(MezzoSquadra.CodiceMezzo)).SelectMany(s => s.Value).ToList(),
                            Km = null,
                            TempoPercorrenza = null,
                        };
                    }).ToList());
                }
                else
                    return new List<PreAccoppiato>(); 
            }
            else
                return new List<PreAccoppiato>();
        }

        private API.Models.Classi.Condivise.Squadra.StatoSquadra MappaStatoSquadra(Task<List<StatoOperativoSquadra>> lstStatoSquadre, string codiceSquadra)
        {
            var squadra = lstStatoSquadre.Result.Find(s => s.IdSquadra.Equals(codiceSquadra));

            if (squadra != null)
            {
                if (squadra.StatoSquadra.Equals("In Viaggio"))
                    return API.Models.Classi.Condivise.Squadra.StatoSquadra.InViaggio;
                else if (squadra.StatoSquadra.Equals("Sul Posto"))
                    return API.Models.Classi.Condivise.Squadra.StatoSquadra.SulPosto;
                else if (squadra.StatoSquadra.Equals("In Rientro"))
                    return API.Models.Classi.Condivise.Squadra.StatoSquadra.InRientro;
                else
                    return API.Models.Classi.Condivise.Squadra.StatoSquadra.InSede;
            }
            else
                return API.Models.Classi.Condivise.Squadra.StatoSquadra.InSede;
        }

        private List<API.Models.Classi.Condivise.Componente> MapMembriInComponenti(List<Models.Classi.ServiziEsterni.OPService.Membro> membri)
        {
            List<Componente> componenti = new List<Componente>();

            foreach (var membro in membri)
            {
                var comp = new Componente(membro.Ruolo, membro.FirstName + " " + membro.LastName)
                {
                    CodiceFiscale = membro.CodiceFiscale,
                    qualifications = membro.qualifications
                };

                componenti.Add(comp);
            }

            return componenti;
        }

        private Coordinate GetCoordinateMezzo(string codiceMezzo, Distaccamento distaccamento)
        {
            var posizioneMezzo = pFlotta.Find(m => m.CodiceMezzo.Equals(codiceMezzo));

            if (posizioneMezzo != null)
                return new API.Models.Classi.Condivise.Coordinate()
                {
                    Latitudine = posizioneMezzo.Localizzazione.Lat,
                    Longitudine = posizioneMezzo.Localizzazione.Lon
                };
            else
                return new API.Models.Classi.Condivise.Coordinate()
                {
                    Latitudine = distaccamento.Coordinate.Latitudine,
                    Longitudine = distaccamento.Coordinate.Longitudine
                };
        }
    }
}
