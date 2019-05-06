
using System.Collections.Generic;
using System.Linq;
using System.Security;
using SO115App.API.Models.Servizi.CQRS.Queries;

namespace SO115App.API.Models.AOP.Validation
{
    public class SintesiMezziMarkerValidatingQueryHandlerDecorator<TQuery, TResult> : ISintesiMezziMarkerQueryHandler<TQuery, TResult> where TQuery : ISintesiMezziMarkerQuery<TResult>
    {
        private readonly ISintesiMezziMarkerQueryHandler<TQuery,TResult> decoratee;
        public SintesiMezziMarkerValidatingQueryHandlerDecorator(
            ISintesiMezziMarkerQueryHandler<TQuery,TResult> decoratee)
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