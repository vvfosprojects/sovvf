using CQRS.Queries;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneUtente.ListaPersonaleVVF
{
    public class PersonaleVVFQuery : IQuery<PersonaleVVFResult>
    {
        public string Nome { get; set; }
        public string Cognome { get; set; }
        public string CodiceFiscale { get; set; }
        public string Text { get; set; }
        public string CodiceSede { get; set; }
    }
}
