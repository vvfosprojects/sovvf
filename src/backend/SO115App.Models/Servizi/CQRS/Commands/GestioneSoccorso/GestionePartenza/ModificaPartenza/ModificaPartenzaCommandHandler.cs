using CQRS.Commands;
using DomainModel.CQRS.Commands.ConfermaPartenze;
using SO115App.API.Models.Classi.Composizione;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Classi.Soccorso.Eventi.Partenze;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.AggiornaStatoMezzo;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.AnnullaPartenza;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.Mezzi;
using SO115App.Models.Servizi.Infrastruttura.GestioneStatoOperativoSquadra;
using System;
using System.Linq;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.ModificaPartenza
{
    public class ModificaPartenzaCommandHandler : ICommandHandler<ModificaPartenzaCommand>
    {
        private readonly IGetRichiestaById _getRichiestaById;
        private readonly IUpDateRichiestaAssistenza _upDateRichiestaAssistenza;
        private readonly IUpdateStatoPartenze _updateStatoPartenze;
        private readonly IUpDateRichiestaAssistenza _updateRichiesta;
        private readonly ISetStatoOperativoMezzo _setStatoOperativoMezzo;
        private readonly ISetStatoSquadra _setStatoSquadra;

        private RichiestaAssistenza Richiesta;

        public ModificaPartenzaCommandHandler(
            IGetRichiestaById getRichiestaById,
            IUpDateRichiestaAssistenza upDateRichiestaAssistenza,
            IUpdateStatoPartenze updateStatoPartenze,
            IUpDateRichiestaAssistenza updateRichiesta,
            ISetStatoOperativoMezzo setStatoOperativoMezzo,
            ISetStatoSquadra setStatoSquadra
        )
        {
            _getRichiestaById = getRichiestaById;
            _upDateRichiestaAssistenza = upDateRichiestaAssistenza;
            _updateStatoPartenze = updateStatoPartenze;
            _updateRichiesta = updateRichiesta;
            _setStatoOperativoMezzo = setStatoOperativoMezzo;
            _setStatoSquadra = setStatoSquadra;
        }

        public void Handle(ModificaPartenzaCommand command)
        {
            Richiesta = _getRichiestaById.GetById(command.ModificaPartenza.CodRichiesta);

            //ANNULLO PARTENZA
            if (command.ModificaPartenza.Annullamento)
            {
                AnnullaPartenza(new AnnullaPartenzaCommand()
                {
                    IdOperatore = command.IdOperatore,
                    IdRichiesta = command.ModificaPartenza.CodRichiesta,
                    TestoMotivazione = command.ModificaPartenza.MotivazioneAnnullamento,
                    TargaMezzo = command.ModificaPartenza.CodMezzoDaAnnullare,
                }, command.ModificaPartenza.DataAnnullamento.Value, command.CodSede);
            }

            //NUOVA PARTENZA
            //NuovaPartenza(new ConfermaPartenzeCommand()
            //{
            //    ConfermaPartenze = new ConfermaPartenze()
            //    {
            //        IdRichiesta = command.ModificaPartenza.CodRichiesta,
            //        CodiceSede = command.CodSede,
            //        IdOperatore = command.IdOperatore,
            //        richiesta = Richiesta,
            //        Partenze = Richiesta.Partenze.Select(c => c.Partenza).ToList()
            //    }
            //});

            ////TRADUCO GLI STATI
            foreach (var stato in command.ModificaPartenza.SequenzaStati.OrderBy(c => c.DataOraAggiornamento))
            {

            }
        }

        private void AnnullaPartenza(AnnullaPartenzaCommand command, DateTime data, string CodSede)
        {
            //GESTISCO RICHIESTA
            var PartenzaToDelete = Richiesta.Partenze.FirstOrDefault(x => x.Partenza.Mezzo.Codice.Equals(command.TargaMezzo));

            new RevocaPerAltraMotivazione(Richiesta, command.TargaMezzo, data, command.IdOperatore, command.TestoMotivazione);

            Richiesta.Partenze.FirstOrDefault(c => c.Partenza.Mezzo.Codice == command.TargaMezzo).PartenzaAnnullata = true;

            _upDateRichiestaAssistenza.UpDate(Richiesta);

            //GESTISCO STATO MEZZI E SQUADRE
            var commandStatoMezzo = new AggiornaStatoMezzoCommand()
            {
                CodiceSede = PartenzaToDelete.Partenza.Mezzo.Distaccamento.Codice,
                IdMezzo = command.TargaMezzo,
                StatoMezzo = Costanti.MezzoInRientro,
                Richiesta = Richiesta,
                DataOraAggiornamento = data,
                IdUtente = command.IdOperatore
            };

            _updateStatoPartenze.Update(commandStatoMezzo);
        }

        private void NuovaPartenza()
        {
            
        }
    }
}
