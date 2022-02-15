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
        private readonly IGetSedi _getSede;

        public GetCompetenzeQueryHandler(IGetCompetenzeByCoordinateIntervento getCompetenze, IGetSedi getSede)
        {
            _getCompetenze = getCompetenze;
            _getSede = getSede;
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

            try
            {
                var alberatura = _getSede.GetAll();

                int i = 1;

                foreach (var codCompetenza in codUOCompetenza)
                {
                    if (i <= 3)
                    {
                        var Distaccamento = _getSede.GetInfoSede(codCompetenza).Result;
                        var info = alberatura.Result.Find(a => a.Codice.Equals(codCompetenza));

                        var x = Distaccamento.Descrizione.ToUpper().Replace("CENTRALE", info.Descrizione);

                        var sede = Distaccamento.MapSede();

                        if (sede != null)
                        {
                            sede.Descrizione = x;

                            listaSedi.Add(sede);
                        }
                    }

                    i++;
                }
            }
            catch (System.Exception e)
            {
                return null;
            }

            return listaSedi;
        }
    }
}
