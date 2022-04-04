using CQRS.Commands;
using SO115App.Models.Classi.Soccorso.Eventi;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.GestioneTrasferimentiChiamate;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.IdentityManagement;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using System;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneTrasferimentiChiamate.AddTrasferimento
{
    public class AddTrasferimentoCommandHandler : ICommandHandler<AddTrasferimentoCommand>
    {
        private readonly IAddTrasferimento _addTrasferimento;
        private readonly IGetRichiesta _getRichiestaById;
        private readonly IGetDistaccamentoByCodiceSede _getSede;
        private readonly IGetUtenteById _getUtenteById;
        private readonly IGetSedi _getSedi;
        private readonly IGetAlberaturaUnitaOperative _getAlberaturaUnitaOperative;

        public AddTrasferimentoCommandHandler(IAddTrasferimento addTrasferimento,
            IGetRichiesta getRichiestaById,
            IGetDistaccamentoByCodiceSede getSede,
            IGetUtenteById getUtenteById,
            IGetSedi getSedi)
        {
            _addTrasferimento = addTrasferimento;
            _getRichiestaById = getRichiestaById;
            _getSede = getSede;
            _getUtenteById = getUtenteById;
            _getSedi = getSedi;
        }

        public void Handle(AddTrasferimentoCommand command)
        {
            var listaSedi = _getSedi.GetAll().Result;

            //GESTIONE RICHIESTA E TRASFERIMENTO
            var sedeA = listaSedi.Find(s => s.Codice.Equals(command.TrasferimentoChiamata.CodSedeA)).Descrizione; //_getSedi.GetInfoSede(command.TrasferimentoChiamata.CodSedeA).Result.Descrizione;
            var sedeDa = listaSedi.Find(s => s.Codice.Equals(command.TrasferimentoChiamata.CodSedeDa)).Descrizione; //_getSedi.GetInfoSede(command.TrasferimentoChiamata.CodSedeDa).Result.Descrizione;

            if (!sedeA.ToUpper().Contains("COMANDO"))
                throw new Exception("Puoi trasferire la chiamata solo verso i comandi");

            if (command.TrasferimentoChiamata.CodSedeA.Equals(command.TrasferimentoChiamata.CodSedeDa))
                throw new Exception("Si sta provando a trasferire una chiamata allo stesso comando");

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
