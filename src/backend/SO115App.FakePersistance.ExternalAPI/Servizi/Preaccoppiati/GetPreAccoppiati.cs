using SO115App.API.Models.Classi.Composizione;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.PreAccoppiati;
using SO115App.Models.Classi.ServiziEsterni.Gac;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using SO115App.Models.Servizi.Infrastruttura.GetPreAccoppiati;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Gac;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.OPService;
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

        public GetPreAccoppiati(IGetSquadre getSquadre, IGetMezziUtilizzabili getMezzi, IGetStatoMezzi getStatoMezzi)
        {
            _getSquadre = getSquadre;
            _getMezzi = getMezzi;
            _getStatoMezzi = getStatoMezzi;
        }

        public async Task<List<PreAccoppiato>> GetAsync(PreAccoppiatiQuery query)
        {
            Task<List<MezzoDTO>> lstMezzi = null;
            var lstStatoMezzi = Task.Run(() => _getStatoMezzi.Get(query.CodiceSede));

            return await Task.Run(() =>
            {
                var lstMezziSquadra = new ConcurrentDictionary<string, Squadra[]>();

                Parallel.ForEach(query.CodiceSede, codice =>
                {
                    var lstSquadre = _getSquadre.GetAllByCodiceDistaccamento(codice.Split('.')[0]).Result.All.ToList();

                    lstSquadre.ForEach(squadra => squadra.CodiciMezziPreaccoppiati?.ToList().ForEach(m =>
                        lstMezziSquadra.TryAdd(m, lstSquadre.Where(s => s.Codice.Equals(squadra.Codice)).Select(s => new Squadra(s.Codice, s.Descrizione, s.Stato)).ToArray())));
                });

                lstMezzi = _getMezzi.GetInfo(lstMezziSquadra.Select(lst => lst.Key).ToList());

                return lstMezziSquadra;
            })
            .ContinueWith(lstMezziSquadra => lstMezziSquadra.Result.SelectMany(squadra =>
            {
                var MezziSquadra = lstMezzi.Result.FindAll(mezzo => mezzo.CodiceMezzo.Equals(squadra.Key));

                return MezziSquadra.Select(mezzo => new PreAccoppiato()
                {
                    CodiceMezzo = mezzo.CodiceMezzo,
                    Distaccamento = mezzo.CodiceDistaccamento,
                    DescrizioneMezzo = mezzo.Descrizione,
                    GenereMezzo = mezzo.Genere,
                    StatoMezzo = lstStatoMezzi.Result.Find(m => m.CodiceMezzo.Equals(mezzo.CodiceMezzo))?.StatoOperativo ?? Costanti.MezzoInSede,
                    Km = null,
                    TempoPercorrenza = null,
                    Squadre = lstMezziSquadra.Result.SelectMany(s => s.Value).ToList()
                });
            }).ToList());
        }
    }
}
