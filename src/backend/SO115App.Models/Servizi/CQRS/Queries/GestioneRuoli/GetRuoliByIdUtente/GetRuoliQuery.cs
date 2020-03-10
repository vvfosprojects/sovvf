using CQRS.Queries;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneRuoli.GetRuoliByIdUtente
{
    /// <summary>
    ///   modella la query al db per il reperimento dei ruoli di un utente
    /// </summary>
    public class GetRuoliQuery : IQuery<GetRuoliResult>
    {
        /// <summary>
        ///   il codice univoco dell'utente per cui si vogliono cercare i ruoli
        /// </summary>
        public string IdUtente { get; set; }
    }
}
