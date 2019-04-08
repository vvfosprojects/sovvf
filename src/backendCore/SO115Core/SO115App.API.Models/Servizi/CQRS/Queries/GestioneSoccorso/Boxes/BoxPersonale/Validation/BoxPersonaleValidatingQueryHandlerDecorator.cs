
using System.Collections.Generic;
using System.Linq;
using System.Security;
using SO115App.API.Models.Servizi.CQRS.Queries;

namespace SO115App.API.Models.AOP.Validation
{
    public class BoxPersonaleValidatingQueryHandlerDecorator<TQuery, TResult> : IBoxPersonaleQueryHandler<TQuery, TResult> where TQuery : IBoxPersonaleQuery<TResult>
    {
        private readonly IBoxPersonaleQueryHandler<TQuery,TResult> decoratee;
        public BoxPersonaleValidatingQueryHandlerDecorator(
            IBoxPersonaleQueryHandler<TQuery,TResult> decoratee)
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