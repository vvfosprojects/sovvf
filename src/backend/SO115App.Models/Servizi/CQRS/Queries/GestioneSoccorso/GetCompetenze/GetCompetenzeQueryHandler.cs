using CQRS.Queries;
using SO115App.API.Models.Classi.Condivise;
using SO115App.Models.Classi.ServiziEsterni.Utility;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Competenze;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GetCompetenze
{
    public class GetCompetenzeQueryHandler : IQueryHandler<GetCompetenzeQuery, GetCompetenzeResult>
    {
        private readonly IGetCompetenzeByCoordinateIntervento _getCompetenze;
        private readonly IGetDistaccamentoByCodiceSedeUC _getCodiciDistaccamenti;
        public GetCompetenzeQueryHandler(IGetCompetenzeByCoordinateIntervento getCompetenze, IGetDistaccamentoByCodiceSedeUC getCodiciDistaccamenti)
        {
            _getCompetenze = getCompetenze;
            _getCodiciDistaccamenti = getCodiciDistaccamenti;
        }

        public GetCompetenzeResult Handle(GetCompetenzeQuery query)
        {
            var lstCodiciCompetenze = _getCompetenze.GetCompetenzeByCoordinateIntervento(query.Coordinate);

            var lstCompetenze = MapCompetenze(lstCodiciCompetenze);

            return new GetCompetenzeResult()
            {
                DataArray = lstCompetenze
            };
        }

        private List<Sede> MapCompetenze(string[] codUOCompetenza)
        {
            var listaSedi = new List<Sede>();
            int i = 1;
            foreach (var codCompetenza in codUOCompetenza)
            {
                if (i <= 3)
                {
                    var Distaccamento = _getCodiciDistaccamenti.Get(codCompetenza).Result;

                    var sede = Distaccamento.MapSede();

                    if (sede != null)
                        listaSedi.Add(sede);
                }

                i++;
            }

            return listaSedi;
        }
    }
}
