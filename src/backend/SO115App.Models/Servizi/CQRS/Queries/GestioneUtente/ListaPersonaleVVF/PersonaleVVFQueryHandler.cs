using CQRS.Queries;
using SO115App.Models.Classi.Utenti.Autenticazione;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Personale;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneUtente.ListaPersonaleVVF
{
    /// <summary>
    ///   l'handler che gestisce la lista degli utenti reperiti su mongoDB e dai servizi esterni
    /// </summary>
    public class PersonaleVVFQueryHandler : IQueryHandler<PersonaleVVFQuery, PersonaleVVFResult>
    {
        private readonly IGetUtenti _getUtenti;
        private readonly IGetPersonaleVVF _getPersonaleVVF;

        public PersonaleVVFQueryHandler(IGetUtenti getUtenti, IGetPersonaleVVF getPersonaleVVF)
        {
            _getUtenti = getUtenti;
            _getPersonaleVVF = getPersonaleVVF;
        }

        /// <summary>
        ///   metodo handler
        /// </summary>
        /// <param name="query">la query in input con i parametri</param>
        /// <returns>un risultato</returns>
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
