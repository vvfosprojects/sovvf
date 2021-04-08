using CQRS.Queries;
using SO115App.API.Models.Classi.Organigramma;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.RicercaRichiesteAssistenza;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Competenze;
using System.Linq;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GetCountInterventiVicinanze
{
    public class GetCountInterventiVicinanzeQueryHandler : IQueryHandler<GetCountInterventiVicinanzeQuery, GetCountInterventiVicinanzeResult>
    {
        private readonly IGetCompetenzeByCoordinateIntervento _getCompetenze;
        private readonly IGetListaSintesi _getListaSintesi;

        public GetCountInterventiVicinanzeQueryHandler(IGetCompetenzeByCoordinateIntervento getCompetenze, IGetListaSintesi getListaSintesi)
        {
            _getCompetenze = getCompetenze;
            _getListaSintesi = getListaSintesi;
        }

        public GetCountInterventiVicinanzeResult Handle(GetCountInterventiVicinanzeQuery query)
        {
            var competenze = _getCompetenze.GetCompetenzeByCoordinateIntervento(query.Coordinate);

            var lstPinNodo = competenze.Select(c => new PinNodo(c, true)).ToHashSet();

            var result = _getListaSintesi.GetListaSintesiRichieste(new FiltroRicercaRichiesteAssistenza()
            {
                UnitaOperative = lstPinNodo
            });

            var resultChiuseStessoIndirizzo = _getListaSintesi.GetListaSintesiRichieste(new FiltroRicercaRichiesteAssistenza()
            {
                UnitaOperative = lstPinNodo,
                SoloChiuse = true
            });

            var resultStessaVia = _getListaSintesi.GetListaSintesiRichieste(new FiltroRicercaRichiesteAssistenza()
            {
                UnitaOperative = lstPinNodo,
                IndirizzoIntervento = new API.Models.Classi.Condivise.Localita(null, query.Indirizzo.Split(',')[0], "")
            });

            return new GetCountInterventiVicinanzeResult()
            {
                Count = result.Count,
                CountInterventiChiusiStessoIndirizzo = resultChiuseStessoIndirizzo.Count,
                CountStessaVia = resultStessaVia.Count
            };
        }
    }
}
