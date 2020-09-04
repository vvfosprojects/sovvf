using CQRS.Commands.Notifiers;
using System;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.ModificaPartenza
{
    public class ModificaPartenzaNotifier : ICommandNotifier<ModificaPartenzaCommand>
    {
        //private readonly 
        public void Notify(ModificaPartenzaCommand command)
        {
            throw new NotImplementedException();
        }
    }
}
