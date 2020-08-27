using CQRS.Commands;
using SO115App.Models.Classi.Soccorso.Eventi;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.GestioneTrasferimentiChiamate;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.IdentityManagement;
using System;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneTrasferimentiChiamate.AddTrasferimento
{
    public class AddTrasferimentoCommandHandler : ICommandHandler<AddTrasferimentoCommand>
    {
        private readonly IAddTrasferimento _addTrasferimento;
        private readonly IGetRichiestaById _getRichiestaById;
        private readonly IGetDistaccamentoByCodiceSede _getSede;
        public AddTrasferimentoCommandHandler(IAddTrasferimento addTrasferimento,
            IGetRichiestaById getRichiestaById,
            IGetDistaccamentoByCodiceSede getSede)
        {
            _addTrasferimento = addTrasferimento;
            _getRichiestaById = getRichiestaById;
            _getSede = getSede;
        }

        public void Handle(AddTrasferimentoCommand command)
        {
            //GESTIONE RICHIESTA E TRASFERIMENTO
            var richiesta = _getRichiestaById.GetByCodice(command.TrasferimentoChiamata.CodRichiesta);

            command.TrasferimentoChiamata.CodSedeDa = richiesta.CodSOCompetente;
            richiesta.CodSOCompetente = command.TrasferimentoChiamata.CodSedeA;
            command.TrasferimentoChiamata.IdOperatore = command.IdOperatore;
            command.TrasferimentoChiamata.Data = DateTime.Now;

            var sedeDa = _getSede.Get(command.TrasferimentoChiamata.CodSedeDa).Descrizione;
            var sedeA = _getSede.Get(command.TrasferimentoChiamata.CodSedeA).Descrizione;

            new TrasferimentoChiamata(richiesta, command.TrasferimentoChiamata.Data, command.IdOperatore, sedeDa, sedeA);

            //DB SYNC
            _addTrasferimento.Add(command.TrasferimentoChiamata, richiesta);
        }
    }
}
