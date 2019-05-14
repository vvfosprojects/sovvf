using System;
using System.Collections.Generic;
using System.Text;
using CQRS.Commands;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;

namespace DomainModel.CQRS.Commands.AddIntervento
{
    public class AddInterventoCommandCommandHandler : ICommandHandler<AddInterventoCommand>
    {
        private readonly ISaveRichiestaAssistenza _saveRichiestaAssistenza;
        public AddInterventoCommandCommandHandler(ISaveRichiestaAssistenza saveRichiestaAssistenza)
        {
            this._saveRichiestaAssistenza = saveRichiestaAssistenza;
        }

        public void Handle(AddInterventoCommand command)
        {
            // Here the user should be added.
            //
            // A good strategy consists in injecting the class
            // providing the service, e.g. a class encapsulating
            // the database query, located in the persistence
            // layer and implemented by a class library explicitely
            // aimed at providing the persistence services against
            // the chosen database technology (e.g. relational
            // database, document database, etc.).
            //
            // In this fake implementation we simply do nothing.



            }
    }
}
