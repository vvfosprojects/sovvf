using SO115App.API.Models.Classi.Composizione;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.PreAccoppiati;
using SO115App.Models.Classi.ServiziEsterni.Gac;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
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
        private readonly IGetDistaccamentoByCodiceSedeUC _getDistaccamentoByCodiceSedeUC;

        public GetPreAccoppiati(IGetDistaccamentoByCodiceSedeUC getDistaccamentoByCodiceSedeUC, IGetSquadre getSquadre, IGetMezziUtilizzabili getMezzi,
                                IGetStatoMezzi getStatoMezzi, IGetStatoSquadra getStatoSquadre, IGetTurno getTurno)
        {
            _getSquadre = getSquadre;
            _getMezzi = getMezzi;
            _getStatoMezzi = getStatoMezzi;
            _getStatoSquadre = getStatoSquadre;
            _getTurno = getTurno;
            _getDistaccamentoByCodiceSedeUC = getDistaccamentoByCodiceSedeUC;
        }

        public async Task<List<PreAccoppiato>> GetAsync(PreAccoppiatiQuery query)
        {
            Task<List<MezzoDTO>> lstMezzi = null;
            var lstStatoMezzi = Task.Run(() => _getStatoMezzi.Get(query.CodiceSede));
            var lstStatoSquadre = Task.Run(() => _getStatoSquadre.Get(_getTurno.Get().Codice, query.CodiceSede.ToList()));

            return await Task.Run(() => //OTTENGO I DATI
            {
                var lstSquadreMezzo = new ConcurrentDictionary<string, Squadra[]>();

                Parallel.ForEach(query.CodiceSede, codice =>
                {
                    var lstSquadre = _getSquadre.GetAllByCodiceDistaccamento(codice.Split('.')[0]).Result.Squadre.ToList();

                    lstSquadre.Where(s => !s.spotType.Equals("MODULE")).ToList().ForEach(squadra => squadra.CodiciMezziPreaccoppiati?.ToList().ForEach(m =>
                        lstSquadreMezzo.TryAdd(m, lstSquadre
                            .Where(s => s.Codice.Equals(squadra.Codice))
                            .Select(s => new Squadra(s.Codice, s.Descrizione, MappaStatoSquadraDaStatoMezzo.MappaStato(squadra.Stato)))
                            .ToArray())));
                });

                lstMezzi = _getMezzi.GetInfo(lstSquadreMezzo.Select(lst => lst.Key).ToList());

                return lstSquadreMezzo;
            })
            .ContinueWith(lstMezziSquadra => lstMezziSquadra.Result.Select(squadreMezzo => //MAPPING
            {
                var MezzoSquadra = lstMezzi.Result.Find(mezzo => mezzo.CodiceMezzo.Equals(squadreMezzo.Key));

                var DescSede = _getDistaccamentoByCodiceSedeUC.Get(MezzoSquadra.CodiceDistaccamento).Result;

                return new PreAccoppiato()
                {
                    CodiceMezzo = MezzoSquadra.CodiceMezzo,
                    Distaccamento = DescSede.DescDistaccamento/*.Replace("Comando VV.F. di ", "Centrale ").Replace("Distaccamento Cittadino ", "")*/.ToUpper(),
                    DescrizioneMezzo = MezzoSquadra.Descrizione,
                    GenereMezzo = MezzoSquadra.Genere,
                    StatoMezzo = lstStatoMezzi.Result.Find(m => m.CodiceMezzo.Equals(MezzoSquadra.CodiceMezzo))?.StatoOperativo ?? Costanti.MezzoInSede,
                    Squadre = lstMezziSquadra.Result.Where(s => s.Key.Equals(MezzoSquadra.CodiceMezzo)).SelectMany(s => s.Value).ToList(),
                    Km = null,
                    TempoPercorrenza = null,
                };
            }).ToList());
        }
    }
}
