using CQRS.Queries;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti.GestioneRuolo;
using System;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneRuoli.GetRuoliByIdUtente
{
    /// <summary>
    ///   la classe che gestisce la query da inviare al db
    /// </summary>
    internal class GetRuoliQueryHandler : IQueryHandler<GetRuoliQuery, GetRuoliResult>
    {
        private readonly IGetRuoliById _getRuoliById;

        /// <summary>
        ///   costruttore della classe
        /// </summary>
        /// <param name="getRuoliById">servizio per il recupero dei ruoli</param>
        public GetRuoliQueryHandler(IGetRuoliById getRuoliById)
        {
            _getRuoliById = getRuoliById;
        }

        public GetRuoliResult Handle(GetRuoliQuery query)
        {
            if (string.IsNullOrWhiteSpace(query.IdUtente))
                throw new NotImplementedException("Impossibile cercare l'utente senza l'id");

            return new GetRuoliResult
            {
                Ruoli = _getRuoliById.Get(query.IdUtente)
            };
        }
    }
}
