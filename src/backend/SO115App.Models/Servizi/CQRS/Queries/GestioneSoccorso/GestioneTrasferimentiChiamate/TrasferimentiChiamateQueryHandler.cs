using CQRS.Queries;
using SO115App.API.Models.Classi.Organigramma;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Classi.Organigramma;
using SO115App.Models.Servizi.Infrastruttura.GestioneTrasferimentiChiamate;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.IdentityManagement;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GestioneTrasferimentiChiamate
{
    public class TrasferimentiChiamateQueryHandler : IQueryHandler<TrasferimentiChiamateQuery, TrasferimentiChiamateResult>
    {
        private readonly IGetTrasferimenti _getTrasferimenti;
        private readonly IGetUtenteById _getUtenteById;
        private readonly IGetSedi _getSedi;
        private readonly IGetDistaccamentoByCodiceSede _getDistaccamentoByCodiceSede;
        private readonly GerarchiaReader _getGerarchia;

        public TrasferimentiChiamateQueryHandler(IGetTrasferimenti getTrasferimenti,
            IGetUtenteById getUtenteById,
            IGetSedi getSedi,
            IGetDistaccamentoByCodiceSede getDistaccamentoByCodiceSede,
            IGetAlberaturaUnitaOperative getAlberaturaUnitaOperative)
        {
            _getTrasferimenti = getTrasferimenti;
            _getUtenteById = getUtenteById;
            _getSedi = getSedi;
            _getDistaccamentoByCodiceSede = getDistaccamentoByCodiceSede;
            _getGerarchia = new GerarchiaReader(getAlberaturaUnitaOperative);
        }

        public TrasferimentiChiamateResult Handle(TrasferimentiChiamateQuery query)
        {
            //GESTIONE RICORSIVITA'
            var lstPin = new List<PinNodo>();

            foreach (var sede in query.CodiciSede)
                lstPin.AddRange(_getGerarchia.GetGerarchiaFull(sede).ToList());

            var lstSedi = _getSedi.GetAll().Result;
            //MAPPING
            var lstTrasferimenti = _getTrasferimenti.GetAll(lstPin.Select(p => p.Codice).ToArray(), query.Filters.Search)
                .Select(c => new TrasferimentoChiamataFull()
                {
                    Id = c.Id,
                    CodChiamata = c.CodChiamata,
                    SedeA = lstSedi.Find(s => s.Codice.Equals(c.CodSedeA)).Descrizione,
                    SedeDa = lstSedi.Find(s => s.Codice.Equals(c.CodSedeDa)).Descrizione,
                    Data = c.Data,
                    Operatore = _getUtenteById.GetUtenteByCodice(c.IdOperatore)
                }).ToList();

            //PAGINAZIONE
            List<TrasferimentoChiamataFull> trasferimentiPaginati = null;

            if (query.Pagination != default)
            {
                lstTrasferimenti.Reverse();
                trasferimentiPaginati = lstTrasferimenti
                    .Skip((query.Pagination.Page - 1) * query.Pagination.PageSize)
                    .Take(query.Pagination.PageSize).ToList();
                query.Pagination.TotalItems = lstTrasferimenti.Count;
            }
            else trasferimentiPaginati = lstTrasferimenti;

            //ORDINAMENTO
            return new TrasferimentiChiamateResult()
            {
                DataArray = trasferimentiPaginati.OrderByDescending(c => c.Data).ToList(),
                Pagination = query.Pagination
            };
        }
    }
}
