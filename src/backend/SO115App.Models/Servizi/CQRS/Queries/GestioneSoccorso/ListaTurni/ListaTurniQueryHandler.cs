using CQRS.Queries;
using SO115App.Models.Servizi.Infrastruttura.Turni;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.ListaTurni
{
    internal class ListaTurniQueryHandler : IQueryHandler<ListaTurniQuery, ListaTurniResult>
    {
        private readonly IGetTurno _getTurno;

        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        public ListaTurniQueryHandler(IGetTurno getTurno)
        {
            _getTurno = getTurno;
        }

        /// <summary>
        ///   Metodo di esecuzione della query
        /// </summary>
        /// <param name="query">Il DTO di ingresso della query</param>
        /// <returns>Il DTO di uscita della query</returns>
        public ListaTurniResult Handle(ListaTurniQuery query)
        {
            var listaTurni = _getTurno.Get();

            return new ListaTurniResult()
            {
                Turno = listaTurni
            };
        }
    }
}
