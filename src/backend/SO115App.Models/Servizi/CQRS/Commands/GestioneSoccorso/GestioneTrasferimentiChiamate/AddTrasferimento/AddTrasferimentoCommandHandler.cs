using CQRS.Commands;
using SO115App.Models.Servizi.Infrastruttura.GestioneTrasferimentiChiamate;
using System;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneTrasferimentiChiamate.AddTrasferimento
{
    public class AddTrasferimentoCommandHandler : ICommandHandler<AddTrasferimentoCommand>
    {
        private readonly IAddTrasferimento _addTrasferimento;
        public AddTrasferimentoCommandHandler(IAddTrasferimento addTrasferimento) => _addTrasferimento = addTrasferimento;

        public void Handle(AddTrasferimentoCommand command)
        {
            command.TrasferimentoChiamata.Data = command.TrasferimentoChiamata.Data == DateTime.MinValue ? DateTime.Now : command.TrasferimentoChiamata.Data;
            command.TrasferimentoChiamata.CodSedeDa = command.CodiceSede;
            command.TrasferimentoChiamata.IdOperatore = command.IdOperatore;

            _addTrasferimento.Add(command.TrasferimentoChiamata);
        }
    }
}
