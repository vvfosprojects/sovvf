using CQRS.Queries;
using SO115App.Models.Servizi.Infrastruttura.GestioneRubrica.Categorie;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneRubrica.Categorie
{
    public class CategorieEntiQueryHandler : IQueryHandler<CategorieEntiQuery, CategorieEntiResult>
    {
        private readonly IGetEnteCategorie _getEnteCategorie;
        public CategorieEntiQueryHandler(IGetEnteCategorie getEnteCategorie) => _getEnteCategorie = getEnteCategorie;

        public CategorieEntiResult Handle(CategorieEntiQuery query)
        {
            var result = _getEnteCategorie.Get();

            return new CategorieEntiResult()
            {
                DataArray = result
            };
        }
    }
}
