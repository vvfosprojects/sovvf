
using System.Collections.Generic;
using System.Linq;
using System.Security;
using SO115App.API.Models.Servizi.CQRS.Queries;

namespace SO115App.API.Models.AOP.Validation
{
    public class BoxMezziValidatingQueryHandlerDecorator<TQuery, TResult> : IBoxMezziQueryHandler<TQuery, TResult> where TQuery : IBoxMezziQuery<TResult>
    {
        private readonly IBoxMezziQueryHandler<TQuery,TResult> decoratee;
        public BoxMezziValidatingQueryHandlerDecorator(
            IBoxMezziQueryHandler<TQuery,TResult> decoratee)
        {           
            this.decoratee = decoratee;
        }

        public TResult Handle(TQuery query)
        {
            this.Validate();

            return this.decoratee.Handle(query);
        }

        private void Validate()
        {
            //ESEMPIO - DA MODIFICARE CON LA LOGICA DI AUTORIZZAZIONE
            if (false)
            {
                //TODO AGGIUNGERE METODO PER VERIFICA AUTORIZZAZIONI SU DB

                throw new SecurityException();

            }else
            {

       
            }
        }


    }
}