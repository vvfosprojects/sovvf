using CQRS.Queries;
using SO115App.API.Models.Classi.Organigramma;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Personale;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneUtente.ListaOperatori
{
    public class ListaOperatoriQueryHandler : IQueryHandler<ListaOperatoriQuery, ListaOperatoriResult>
    {
        private readonly IGetUtenti _getUtenti;
        private readonly IGetUtenteById _getUtenteById;
        private readonly IGetAlberaturaUnitaOperative _getAlberaturaUnitaOperative;

        public ListaOperatoriQueryHandler(IGetUtenti getUtenti, IGetUtenteById getUtenteById, IGetAlberaturaUnitaOperative getAlberaturaUnitaOperative)
        {
            _getUtenti = getUtenti;
            _getUtenteById = getUtenteById;
            _getAlberaturaUnitaOperative = getAlberaturaUnitaOperative;
        }

        public ListaOperatoriResult Handle(ListaOperatoriQuery query)
        {
            var utente = _getUtenteById.GetUtenteByCodice(query.IdUtente);
            var listaCodiciSedeRuoloAdmin = new List<string>();
            var sediAlberate = _getAlberaturaUnitaOperative.ListaSediAlberata();
            var listaPin = new List<PinNodo>();

            foreach (var ruolo in utente.Ruoli.FindAll(x => x.Descrizione.Equals("Amministratore")))
            {
                listaCodiciSedeRuoloAdmin.Add(ruolo.CodSede);
                if (ruolo.Ricorsivo)
                {
                    listaPin.Add(new PinNodo(ruolo.CodSede, ruolo.Ricorsivo));
                    foreach (var figli in sediAlberate.GetSottoAlbero(listaPin))
                    {
                        listaCodiciSedeRuoloAdmin.Add(figli.Codice);
                    }
                }
            }
            var utenti = _getUtenti.Get(query.CodiceSede, query.Filters.Search);
            utenti.Reverse();
            var utentiPaginati = utenti.Skip((query.Pagination.Page - 1) * query.Pagination.PageSize).Take(query.Pagination.PageSize).ToList();
            query.Pagination.TotalItems = utenti.Count;
            return new ListaOperatoriResult
            {
                DataArray = utentiPaginati,
                Pagination = query.Pagination
            };
        }
    }
}
