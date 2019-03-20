namespace SO115App.API.Models.AOP.Authorization
{
    using System.Security;
    using System.Security.Principal;
    using Microsoft.Extensions.Logging;
    using SO115App.API.Models.Servizi.CQRS.Commands;

    public class AuthorizationCommandHandlerDecorator<TCommand> : ICommandHandler<TCommand>
    {
        private readonly ICommandHandler<TCommand> decoratedHandler;
        private readonly IPrincipal currentUser;
        //private readonly ILogger logger;

        public AuthorizationCommandHandlerDecorator(ICommandHandler<TCommand> decoratedHandler,
            IPrincipal currentUser) //, ILogger logger)
        {
            this.decoratedHandler = decoratedHandler;
            this.currentUser = currentUser;
            //this.logger = logger;
        }

        public void Handle(TCommand query)
        {
            this.Authorize();

            this.decoratedHandler.Handle(query);
        }

        private void Authorize()
        {
            //ESEMPIO - DA MODIFICARE CON LA LOGICA DI AUTORIZZAZIONE
            if (typeof(TCommand).Namespace.Contains("Admin") && !this.currentUser.IsInRole("Admin"))
            {

                // this.logger.Log(LogLevel.Information,"L'Utente " + this.currentUser.Identity.Name + " non è autorizzato ad utilizzare la funzionalità " +
                //     typeof(TCommand).Name);

                throw new SecurityException();
            }



        }
    }
}