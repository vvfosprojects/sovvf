namespace SO115App.API.Models.AOP.Authorization
{
    using System.Security;
    using System.Security.Principal;
    using SO115App.API.Models.Servizi.CQRS.Queries;
    using SO115App.API.Models.Servizi.Infrastruttura;

    public class SintesiRichiesteAssistenzaAuthorizationQueryHandlerDecorator<TQuery, TResult> : ISintesiRichiestaAssistenzaQueryHandler<TQuery, TResult> 
        where TQuery : ISintesiRichiestaQuery<TResult>
    {
        private readonly ISintesiRichiestaAssistenzaQueryHandler<TQuery, TResult> decoratedHandler;
        private readonly IPrincipal currentUser;

        public SintesiRichiesteAssistenzaAuthorizationQueryHandlerDecorator(ISintesiRichiestaAssistenzaQueryHandler<TQuery, TResult> decoratedHandler,
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