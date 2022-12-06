using SO115App.API.Models.Classi.Composizione;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.PreAccoppiati;
using SO115App.Models.Classi.Composizione;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Classi.ServiziEsterni;
using SO115App.Models.Classi.ServiziEsterni.Gac;
using SO115App.Models.Classi.ServiziEsterni.OPService;
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
        private readonly IGetSedi _getSedi;

        //private readonly IGetDistaccamentoByCodiceSedeUC _getDistaccamentoByCodiceSedeUC;

        private readonly List<MessaggioPosizione> pFlotta = new();

        public GetPreAccoppiati(IGetDistaccamentoByCodiceSedeUC getDistaccamentoByCodiceSedeUC, IGetSquadre getSquadre, IGetMezziUtilizzabili getMezzi,
                                IGetStatoMezzi getStatoMezzi, IGetStatoSquadra getStatoSquadre, IGetTurno getTurno,
                                IGetPosizioneFlotta getPosizioneFlotta, IGetSedi getSedi)
        {
            _getSquadre = getSquadre;
            _getMezzi = getMezzi;
            _getStatoMezzi = getStatoMezzi;
            _getStatoSquadre = getStatoSquadre;
            _getTurno = getTurno;
            _getPosizioneFlotta = getPosizioneFlotta;
            _getSedi = getSedi;
            //_getDistaccamentoByCodiceSedeUC = getDistaccamentoByCodiceSedeUC;

            pFlotta = _getPosizioneFlotta.Get(0).Result;
        }

        public async Task<List<PreAccoppiato>> GetAsync(PreAccoppiatiQuery query)
        {
            var lstProvinceSedi = query.CodiceSede.Select(sede => sede.Split('.')[0]).Distinct().ToList();
            var lstSedi = _getSedi.GetAll().Result;
            var codiceTurno = Task.Run(() => _getTurno.Get().Codice.Substring(0, 1));

            var lstStatoMezzi = Task.Run(() => _getStatoMezzi.Get(query.CodiceSede)).Result;
            lstStatoMezzi = lstStatoMezzi.FindAll(s => !s.StatoOperativo.Equals(Costanti.MezzoRientrato));

            var lstStatoSquadre = Task.Run(async () => _getStatoSquadre.Get(await codiceTurno, query.CodiceSede.ToList())).Result;
            lstStatoSquadre = lstStatoSquadre.FindAll(s => !s.StatoSquadra.Equals(Costanti.MezzoRientrato));

            var lstSquadreWS = lstProvinceSedi.Select(sede => _getSquadre.GetAllByCodiceDistaccamento(sede)).Where(s => s.Result != null).ToList();

            var lstSquadre = new List<SquadraOpService>();

            if (query.Filtri?.Turno != null)
            {
                if (query.Filtri.Turno.Equals("0"))
                    lstSquadre = lstSquadreWS.SelectMany(shift => shift.Result?.Precedente?.Squadre).ToList();
                else if (query.Filtri.Turno.Equals("1"))
                    lstSquadre = lstSquadreWS.SelectMany(shift => shift.Result?.Successivo?.Squadre).ToList();
                else
                    lstSquadre = lstSquadreWS.SelectMany(shift => shift.Result?.Attuale?.Squadre).ToList();
            }
            else
            {
                lstSquadre = lstSquadreWS.SelectMany(shift => shift.Result?.Attuale?.Squadre).ToList();
            }

            var lstSquadrePreaccoppiate = lstSquadre.Where(s => s.CodiciMezziPreaccoppiati?.Any() ?? false && !s.spotType.Equals("MODULE")).ToList();

            if (!lstSquadrePreaccoppiate.Any())
                return new List<PreAccoppiato>();

            var lstMezziPreaccoppiati = lstSquadrePreaccoppiate.SelectMany(s => _getMezzi.GetInfo(s.CodiciMezziPreaccoppiati.ToList()).Result).ToList();

            var result = await Task.Run(() => // MAPPING
            {
                var lstSquadreMezzo = new List<PreAccoppiato>();

                foreach (var squadraPreaccoppiata in lstSquadrePreaccoppiate)
                {
                    foreach (var mezzoPreaccoppiato in squadraPreaccoppiata.CodiciMezziPreaccoppiati)
                    {
                        var mezzo = lstMezziPreaccoppiati.First(m => m.CodiceMezzo.Equals(mezzoPreaccoppiato));

                        var preaccoppiato = new PreAccoppiato()
                        {
                            CodiceMezzo = mezzoPreaccoppiato,
                            Appartenenza = mezzo.CodiceDistaccamento,
                            Squadre = lstSquadrePreaccoppiate.Where(s => s.CodiciMezziPreaccoppiati?.Contains(mezzoPreaccoppiato) ?? false).Select(s => new Squadra()
                            {
                                IdSquadra = s.spotId,
                                Distaccamento = lstSedi.FirstOrDefault(d => d.Codice.Equals(s.Distaccamento)) ?? null,
                                Codice = s.Codice,
                                Nome = s.Codice,
                                Stato = MappaStatoSquadraDaStatoMezzo.MappaStato(lstStatoSquadre?.FirstOrDefault(ss => ss.IdSquadra.Equals($"{s.Codice}_{s.TurnoAttuale}"))?.StatoSquadra ?? Costanti.MezzoInSede),
                                Turno = s.TurnoAttuale,
                                DiEmergenza = s.Emergenza,
                                Membri = lstSquadrePreaccoppiate.FirstOrDefault(sq => sq.Codice.Equals(s.Codice))?.Membri.Select(m => new Componente()
                                {
                                    CodiceFiscale = m.CodiceFiscale,
                                    DescrizioneQualifica = m.Ruolo,
                                    Nominativo = $"{m.FirstName} {m.LastName}",
                                    Ruolo = m.Ruolo
                                }).ToList(),
                            }).ToList(),
                            StatoMezzo = lstStatoMezzi.FirstOrDefault(m => squadraPreaccoppiata.CodiciMezziPreaccoppiati?.Any(c => c.Equals(m.CodiceMezzo) && !m.StatoOperativo.Equals("Rientrato")) ?? false)?.StatoOperativo ?? Costanti.MezzoInSede,

                            Distaccamento = mezzo.DescrizioneAppartenenza,
                            DescrizioneMezzo = mezzo.Descrizione,
                            GenereMezzo = mezzo.Genere,
                            Sigla = mezzo.Sigla,
                            Modello = mezzo.Modello,
                            Coordinate = default,
                            Km = null,
                            TempoPercorrenza = null
                        };

                        if (!lstSquadreMezzo.Select(s => s.CodiceMezzo).Contains(preaccoppiato.CodiceMezzo))
                            lstSquadreMezzo.Add(preaccoppiato);
                    }
                }

                return lstSquadreMezzo;
            })
            .ContinueWith(preaccoppiati => preaccoppiati.Result.Where(p => // FILTRAGGIO
            {
                var distaccamento = query.Filtri?.CodiceDistaccamento?.Contains(p.Appartenenza) ?? true;

                var statoMezzo = query.Filtri?.StatoMezzo?.Contains(p.StatoMezzo) ?? true;

                var genereMezzo = query.Filtri?.TipoMezzo?.Contains(p.GenereMezzo) ?? true;

                return distaccamento && statoMezzo && genereMezzo;
            }).ToList());

            return result;
        }

        private static API.Models.Classi.Condivise.Squadra.StatoSquadra MappaStatoSquadra(List<StatoOperativoSquadra> lstStatoSquadre, string codiceSquadra, string codiceTurno)
        {
            var squadra = lstStatoSquadre.Find(s => s.IdSquadra.Equals($"{codiceSquadra}_{codiceTurno}"));

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

        private static List<Componente> MapMembriInComponenti(List<Models.Classi.ServiziEsterni.OPService.Membro> membri)
        {
            List<Componente> componenti = new();

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
                return new Coordinate()
                {
                    Latitudine = posizioneMezzo.Localizzazione.Lat,
                    Longitudine = posizioneMezzo.Localizzazione.Lon
                };
            else
                return new Coordinate()
                {
                    Latitudine = distaccamento.Coordinate.Latitudine,
                    Longitudine = distaccamento.Coordinate.Longitudine
                };
        }
    }
}
