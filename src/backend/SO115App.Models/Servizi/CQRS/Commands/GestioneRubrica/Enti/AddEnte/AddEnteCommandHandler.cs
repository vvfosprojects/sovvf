﻿using CQRS.Commands;
using SO115App.Models.Servizi.Infrastruttura.GestioneRubrica.Enti;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneRubrica.Enti.AddEnte
{
    public class AddEnteCommandHandler : ICommandHandler<AddEnteCommand>
    {
        private readonly IAddEnte _addEnte;
        public AddEnteCommandHandler(IAddEnte addEnte) => _addEnte = addEnte;

        public void Handle(AddEnteCommand command)
        {
            command.Ente.CodSede = command.CodiceSede[0];

            _addEnte.Add(command.Ente);
        }
    }
}
