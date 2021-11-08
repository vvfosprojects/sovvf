using CQRS.Queries;
using SO115App.API.Models.Classi.Organigramma;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneSedi.GetDistaccamentiByCodSede
{
    public class GetDistaccamentiByCodSedeQueryHandler : IQueryHandler<GetDistaccamentiByCodSedeQuery, GetDistaccamentiByCodSedeResult>
    {
        private readonly IGetSedi _service;
        private readonly IGetAlberaturaUnitaOperative _getAlberaturaUnitaOperative;

        public GetDistaccamentiByCodSedeQueryHandler(IGetSedi service, IGetAlberaturaUnitaOperative getAlberaturaUnitaOperative)
        {
            _getAlberaturaUnitaOperative = getAlberaturaUnitaOperative;
            _service = service;
        }

        public GetDistaccamentiByCodSedeResult Handle(GetDistaccamentiByCodSedeQuery query)
        {
            var listaSediAlberate = _getAlberaturaUnitaOperative.ListaSediAlberata();
            var lstSedi = _service.GetAll().Result;

            List<PinNodo> pinNodi = new List<PinNodo>();
            foreach (var sede in query.CodiciSede)
            {
                pinNodi.Add(new PinNodo(sede, true));
            }

            List<PinNodo> listaNodiInteressati = new List<PinNodo>();
            listaNodiInteressati.AddRange(listaSediAlberate.Result.GetSottoAlbero(pinNodi).Select(figlio => new PinNodo(figlio.Codice, true)));
            var arrayCodiciSede = listaNodiInteressati.Select(n => n.Codice).ToArray();

            var result = lstSedi.Where(c => arrayCodiciSede.Any(s => s.Equals(c.Codice))).OrderBy(c => c.Codice).ToList();

            return new GetDistaccamentiByCodSedeResult() { DataArray = result };
        }
    }
}
