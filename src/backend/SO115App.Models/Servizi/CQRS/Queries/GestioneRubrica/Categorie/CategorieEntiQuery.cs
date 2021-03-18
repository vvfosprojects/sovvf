using CQRS.Queries;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneRubrica.Categorie
{
    public class CategorieEntiQuery : IQuery<CategorieEntiResult>
    {
        public string[] IdSede { get; set; }
        public string IdOperatore { get; set; }
    }
}
