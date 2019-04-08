namespace SO115App.API.Models.AOP.Authorization
{
    using System.Security;
    using System.Security.Principal;
    using SO115App.API.Models.Servizi.CQRS.Queries;
    using SO115App.API.Models.Servizi.Infrastruttura;

    public class BoxRichiesteAuthorizationQueryHandlerDecorator<TQuery, TResult> : IBoxRichiesteQueryHandler<TQuery, TResult> 
        where TQuery : IBoxRichiesteQuery<TResult>
    {
        private readonly IBoxRichiesteQueryHandler<TQuery, TResult> decoratedHandler;
        private readonly IPrincipal currentUser;

        public BoxRichiesteAuthorizationQueryHandlerDecorator(IBoxRichiesteQueryHandler<TQuery, TResult> decoratedHandler,
            IPrincipal currentUser)
        { 
            this.decoratedHandler = decoratedHandler;
            this.currentUser = currentUser;
        }

        public TResult Handle(TQuery query)
        {
            this.Authorize();

            return this.decoratedHandler.Handle(query);
        }

        private void Authorize()
        {
            //ESEMPIO - DA MODIFICARE CON LA LOGICA DI AUTORIZZAZIONE
            if (typeof(TQuery).Namespace.Contains("Admin") && !this.currentUser.IsInRole("Admin"))
            {

                //TODO AGGIUNGERE METODO PER VERIFICA AUTORIZZAZIONI SU DB

                throw new SecurityException();

            }else
            {

       
            }
        }
    }
}