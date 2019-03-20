namespace SO115App.API.Models.AOP.Authorization
{
    using System.Security;
    using System.Security.Principal;
    using SO115App.API.Models.Servizi.CQRS.Queries;
    using SO115App.API.Models.Servizi.Infrastruttura;

    public class AuthorizationQueryHandlerDecorator<TQuery, TResult> : IQueryHandler<TQuery, TResult> 
        where TQuery : IQuery<TResult>
    {
        private readonly IQueryHandler<TQuery, TResult> decoratedHandler;
        private readonly IPrincipal currentUser;
        private readonly ILogger logger;

        public AuthorizationQueryHandlerDecorator(IQueryHandler<TQuery, TResult> decoratedHandler,
            IPrincipal currentUser, ILogger logger)
        {
            this.decoratedHandler = decoratedHandler;
            this.currentUser = currentUser;
            this.logger = logger;
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

                 this.logger.Log("L'Utente " + this.currentUser.Identity.Name + " non è autorizzato ad utilizzare la funzionalità ");

                throw new SecurityException();

            }else
            {

                this.logger.Log("L'Utente " + this.currentUser.Identity.Name + " è autorizzato ad utilizzare la funzionalità ");
            
            }
        }
    }
}