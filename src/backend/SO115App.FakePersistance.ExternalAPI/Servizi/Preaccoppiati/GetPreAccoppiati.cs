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

        private readonly List<MessaggioPosizione> pFlotta = new();

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
            var lstStatoMezzi = _getStatoMezzi.Get(query.CodiceSede);
            var lstStatoSquadre = _getStatoSquadre.Get(_getTurno.Get().Codice, query.CodiceSede.ToList());

            var lstProvinceSedi = query.CodiceSede.Select(sede => sede.Split('.')[0]).Distinct();
            var lstSquadreWS = lstProvinceSedi.Select(sede => _getSquadre.GetAllByCodiceDistaccamento(sede).Result).ToList();

            var lstSquadre = new List<Models.Classi.ServiziEsterni.OPService.Squadra>();

            var result = new List<PreAccoppiato>();

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
                {
                    lstSquadre = lstSquadreWS.SelectMany(shift => shift?.Attuale.Squadre).ToList();
                }

                var lstSquadrePreaccoppiate = lstSquadre.Where(s => s.CodiciMezziPreaccoppiati != null && s.CodiciMezziPreaccoppiati.Length > 0 && !s.spotType.Equals("MODULE")).Distinct().ToList();
                var codMezziPreaccoppiati = lstSquadre.Where(s => s.CodiciMezziPreaccoppiati != null && s.CodiciMezziPreaccoppiati.Length > 0 && !s.spotType.Equals("MODULE"))
                    .SelectMany(s => s.CodiciMezziPreaccoppiati).Distinct().ToList();
                var lstMezziPreaccoppiati = _getMezzi.GetBySedi(query.CodiceSede).Result;
                
                result = await Task.Run(() => // MAPPING
                {
                    var lstSquadreMezzo = new List<PreAccoppiato>();

                    foreach (var squadraPreaccoppiata in lstSquadrePreaccoppiate)
                    {
                        foreach (var mezzoPreaccoppiato in squadraPreaccoppiata.CodiciMezziPreaccoppiati)
                        {
                            var mezzo = lstMezziPreaccoppiati.Find(m => m.Codice.Equals(mezzoPreaccoppiato));

                            var preaccoppiato = new PreAccoppiato()
                            {
                                CodiceMezzo = mezzoPreaccoppiato,
                                Appartenenza = squadraPreaccoppiata.Distaccamento,
                                Squadre = lstSquadrePreaccoppiate.Where(s => s.CodiciMezziPreaccoppiati?.Contains(mezzoPreaccoppiato) ?? false).Select(s => new API.Models.Classi.Composizione.Squadra()
                                {
                                    Codice = s.Codice,
                                    Nome = s.Descrizione,
                                    Stato = MappaStatoSquadra(lstStatoSquadre, s.Codice),
                                    Membri = MapMembriInComponenti(s.Membri.ToList())
                                }).ToList(),
                                StatoMezzo = lstStatoMezzi.FirstOrDefault(m => squadraPreaccoppiata.CodiciMezziPreaccoppiati?.Any(c => c.Equals(m.CodiceMezzo)) ?? false)?.StatoOperativo ?? Costanti.MezzoInSede,

                                Distaccamento = mezzo?.Distaccamento?.Descrizione,
                                Coordinate = mezzo.Coordinate,
                                DescrizioneMezzo = mezzo.Descrizione,
                                GenereMezzo = mezzo.Genere,

                                Km = null,
                                TempoPercorrenza = null
                            };

                            if(!lstSquadreMezzo.Select(s => s.CodiceMezzo).Contains(preaccoppiato.CodiceMezzo))
                                lstSquadreMezzo.Add(preaccoppiato);
                        }
                    }

                    return lstSquadreMezzo.Distinct();
                })
                .ContinueWith(preaccoppiati => preaccoppiati.Result.Where(p => // FILTRAGGIO
                {
                    var distaccamento = query.Filtri?.CodiceDistaccamento?.Contains(p.Distaccamento) ?? true;

                    var statoMezzo = query.Filtri?.StatoMezzo?.Contains(p.StatoMezzo) ?? true;

                    var genereMezzo = query.Filtri?.TipoMezzo?.Contains(p.GenereMezzo) ?? true;

                    return distaccamento && statoMezzo && genereMezzo;
                }).ToList());
            }

            return result;
        }

        private static API.Models.Classi.Condivise.Squadra.StatoSquadra MappaStatoSquadra(List<StatoOperativoSquadra> lstStatoSquadre, string codiceSquadra)
        {
            var squadra = lstStatoSquadre.Find(s => s.IdSquadra.Equals(codiceSquadra));

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
