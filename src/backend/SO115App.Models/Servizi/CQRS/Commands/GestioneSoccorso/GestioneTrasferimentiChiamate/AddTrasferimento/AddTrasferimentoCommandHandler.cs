using CQRS.Commands;
using SO115App.Models.Classi.Soccorso.Eventi;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.GestioneTrasferimentiChiamate;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.IdentityManagement;
using System;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneTrasferimentiChiamate.AddTrasferimento
{
    public class AddTrasferimentoCommandHandler : ICommandHandler<AddTrasferimentoCommand>
    {
        private readonly IAddTrasferimento _addTrasferimento;
        private readonly IGetRichiesta _getRichiestaById;
        private readonly IGetDistaccamentoByCodiceSede _getSede;
        private readonly IGetUtenteById _getUtenteById;

        public AddTrasferimentoCommandHandler(IAddTrasferimento addTrasferimento,
            IGetRichiesta getRichiestaById,
            IGetDistaccamentoByCodiceSede getSede,
            IGetUtenteById getUtenteById)
        {
            _addTrasferimento = addTrasferimento;
            _getRichiestaById = getRichiestaById;
            _getSede = getSede;
            _getUtenteById = getUtenteById;
        }

        public void Handle(AddTrasferimentoCommand command)
        {
            //GESTIONE RICHIESTA E TRASFERIMENTO
            var sedeA = _getSede.GetSede(command.TrasferimentoChiamata.CodSedeA).Descrizione;

            if (!sedeA.ToUpper().Contains("CENTRALE"))
                throw new Exception("Puoi trasferire la chiamata solo verso le centrali");

            var sedeDa = _getSede.GetSede(command.TrasferimentoChiamata.CodSedeDa).Descrizione;

            var richiesta = _getRichiestaById.GetByCodice(command.TrasferimentoChiamata.CodChiamata);

            //command.TrasferimentoChiamata.CodSedeDa = richiesta.CodSOCompetente;
            richiesta.CodSOCompetente = command.TrasferimentoChiamata.CodSedeA;
            command.TrasferimentoChiamata.IdOperatore = command.IdOperatore;
            command.TrasferimentoChiamata.Data = DateTime.Now;

            var codSedeUtente = _getUtenteById.GetUtenteByCodice(command.TrasferimentoChiamata.IdOperatore).Sede.Descrizione;

            new TrasferimentoChiamata(richiesta, command.TrasferimentoChiamata.Data, command.IdOperatore, sedeDa, sedeA, codSedeUtente);

            //DB SYNC
            _addTrasferimento.Add(command.TrasferimentoChiamata, richiesta);
        }
    }
}
