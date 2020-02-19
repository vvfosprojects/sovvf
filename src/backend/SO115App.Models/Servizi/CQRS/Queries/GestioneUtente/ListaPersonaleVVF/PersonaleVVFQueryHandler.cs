using CQRS.Queries;
using SO115App.Models.Classi.Utenti.Autenticazione;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Personale;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneUtente.ListaPersonaleVVF
{
    public class PersonaleVVFQueryHandler : IQueryHandler<PersonaleVVFQuery, PersonaleVVFResult>
    {
        private readonly IGetUtenti _getUtenti;
        private readonly IGetPersonaleVVF _getPersonaleVVF;

        public PersonaleVVFQueryHandler(IGetUtenti getUtenti, IGetPersonaleVVF getPersonaleVVF)
        {
            _getUtenti = getUtenti;
            _getPersonaleVVF = getPersonaleVVF;
        }

        public PersonaleVVFResult Handle(PersonaleVVFQuery query)
        {
            var listaPersonaleVVF = _getPersonaleVVF.Get(query.Text, query.CodiceSede).Result;
            var listaUtenti = _getUtenti.Get(query.CodiceSede);
            var listaUtentiNonCensiti = new List<PersonaleVVF>();
            foreach (var personale in listaPersonaleVVF)
            {
                if (listaUtenti.Where(x => x.CodiceFiscale == personale.CodFiscale).ToList().Count == 0)
                {
                    listaUtentiNonCensiti.Add(personale);
                }
            }
            return new PersonaleVVFResult { ListaPersonale = listaUtentiNonCensiti };
        }
    }
}
