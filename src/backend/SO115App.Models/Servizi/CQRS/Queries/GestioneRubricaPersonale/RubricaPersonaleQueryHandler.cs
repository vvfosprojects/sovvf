using CQRS.Queries;
using Newtonsoft.Json;
using SO115App.Models.Classi.RubricaDTO;
using SO115App.Models.Classi.ServiziEsterni.Rubrica;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Personale;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneRubricaPersonale
{
    public class RubricaPersonaleQueryHandler : IQueryHandler<RubricaPersonaleQuery, RubricaPersonaleResult>
    {
        private readonly IGetPersonaleByCF _getPersonaleByCF;

        public RubricaPersonaleQueryHandler(IGetPersonaleByCF getPersonaleByCF)
        {
            _getPersonaleByCF = getPersonaleByCF;
        }

        public RubricaPersonaleResult Handle(RubricaPersonaleQuery query)
        {
            ConcurrentQueue<PersonaleRubrica> result = new ConcurrentQueue<PersonaleRubrica>();

            string json;
            using (var r = new StreamReader(Costanti.ListaSquadre)) json = r.ReadToEnd();

            var listaSquadreJson = JsonConvert.DeserializeObject<IEnumerable<SquadraFake>>(json);

            var lstcodicifiscali = listaSquadreJson
                .Where(c => query.IdSede.Any(s => c.Sede.Contains(s.Substring(0,2))))
                .SelectMany(c => c.ComponentiSquadra)
                .Select(c => c.CodiceFiscale)
                .Distinct()
                .ToArray();

            var lstPersonale = _getPersonaleByCF.Get(lstcodicifiscali, query.IdSede).Result;

            Parallel.ForEach(lstPersonale, personale =>
            {
                var rubricaPersonale = new PersonaleRubrica()
                {
                    Nominativo = $"{personale.cognome} {personale.nome}",
                    Qualifica = personale.qualifica?.descrizione,
                    Sede = personale.sede?.id,
                    Specializzazione = string.Concat(personale.specializzazioni?.Select(s => s?.descrizione + ", ")).TrimEnd(',', ' '),
                    Turno = personale.turno
                };

                result.Enqueue(rubricaPersonale);
            });
                
            //MAPPING
            return new RubricaPersonaleResult()
            {
                DataArray = result.OrderBy(p => p.Nominativo)
                    .Skip(query.Pagination.PageSize * (query.Pagination.Page - 1))
                    .Take(query.Pagination.PageSize).ToList(),

                Pagination = new Classi.Condivise.Paginazione()
                {
                    Page = query.Pagination.Page,
                    PageSize = query.Pagination.PageSize,
                    TotalItems = result.Count
                }
            };
        }
    }
}
