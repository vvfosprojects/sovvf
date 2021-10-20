using CQRS.Queries;
using SO115App.API.Models.Classi.Organigramma;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.RicercaRichiesteAssistenza;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Competenze;
using System.Linq;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GetInterventiVicinanze
{
    public class GetInterventiVicinanzeQueryHandler : IQueryHandler<GetInterventiVicinanzeQuery, GetInterventiVicinanzeResult>
    {
        private readonly IGetCompetenzeByCoordinateIntervento _getCompetenze;
        private readonly IGetListaSintesi _getListaSintesi;

        public GetInterventiVicinanzeQueryHandler(IGetCompetenzeByCoordinateIntervento getCompetenze, IGetListaSintesi getListaSintesi)
        {
            _getCompetenze = getCompetenze;
            _getListaSintesi = getListaSintesi;
        }

        public GetInterventiVicinanzeResult Handle(GetInterventiVicinanzeQuery query)
        {
            //var competenze = _getCompetenze.GetCompetenzeByCoordinateIntervento(query.Coordinate);

            //var lstPinNodo = competenze.Select(c => new PinNodo(c, true)).ToHashSet();

            //var resultStessaVia = _getListaSintesi.GetListaSintesiRichieste(new FiltroRicercaRichiesteAssistenza()
            //{
            //    UnitaOperative = lstPinNodo,
            //    IndirizzoIntervento = new API.Models.Classi.Condivise.Localita(null, query.Indirizzo)
            //});

            //var result = _getListaSintesi.GetListaSintesiRichieste(new FiltroRicercaRichiesteAssistenza()
            //{
            //    UnitaOperative = lstPinNodo
            //});

            //result.RemoveAll(i => resultStessaVia.Select(ii => ii.Codice).Contains(i.Codice));

            //var resultChiuseStessoIndirizzo = _getListaSintesi.GetListaSintesiRichieste(new FiltroRicercaRichiesteAssistenza()
            //{
            //    UnitaOperative = lstPinNodo,
            //    Chiuse = new string[] { "Chiamate chiuse", "Interventi chiusi" }
            //});

            //return new GetInterventiVicinanzeResult()
            //{
            //    DataArray = result,
            //    DataArrayInterventiChiusiStessoIndirizzo = resultChiuseStessoIndirizzo,
            //    DataArrayStessaVia = resultStessaVia
            //};

            return null;
        }
    }
}
