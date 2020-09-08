using CQRS.Authorization;
using CQRS.Commands.Authorizers;
using System;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.ModificaPartenza
{
    public class ModificaPartenzaAuthorization : ICommandAuthorizer<ModificaPartenzaCommand>
    {
        public IEnumerable<AuthorizationResult> Authorize(ModificaPartenzaCommand command)
        {
            if (false)
                yield return new AuthorizationResult("");
        }
    }
}
