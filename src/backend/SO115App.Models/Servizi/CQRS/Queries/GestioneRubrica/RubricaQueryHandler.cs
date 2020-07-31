using CQRS.Queries;
using SO115App.Models.Classi.RubricaDTO;
using SO115App.Models.Servizi.Infrastruttura.GestioneRubrica.Categorie;
using SO115App.Models.Servizi.Infrastruttura.GestioneRubrica.Enti;
using System.Linq;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneRubrica
{
    public class RubricaQueryHandler : IQueryHandler<RubricaQuery, RubricaResult>
    {
        private readonly IGetRubrica _getRurbica;
        private readonly IGetEnteCategorie _getCategorieEnte;
        public RubricaQueryHandler(IGetRubrica getRurbica, IGetEnteCategorie getCategorieEnte)
        {
            _getRurbica = getRurbica;
            _getCategorieEnte = getCategorieEnte;
        }

        public RubricaResult Handle(RubricaQuery query)
        {
            //TODO manca la logica per la ricorsività

            var result = _getRurbica.Get(query.IdSede, true);

            var lstCodiciCategorie = result.Select(c => c.Codice.ToString()).ToArray();

            var lstCategorie = _getCategorieEnte.Get(lstCodiciCategorie);

            //MAPPING
            return new RubricaResult()
            {
                Rubrica = result.Select(c => new EnteDTO()
                { 
                    Id = c.Id,
                    Codice = c.Codice,
                    Cap = c.Cap,
                    Categoria = lstCategorie.Find(z => c.Codice.ToString() == z.Codice),
                    CodComune = c.CodComune,
                    CodSede = c.CodSede,
                    Descrizione = c.Descrizione,
                    Email = c.Email,
                    Indirizzo = c.Indirizzo,
                    NoteEnte = c.NoteEnte,
                    Ricorsivo = c.Ricorsivo,
                    SiglaProvincia = c.SiglaProvincia,
                    Telefoni = c.Telefoni,
                    Zona = c.Zona
                }).ToList()
            };
        }
    }
}
