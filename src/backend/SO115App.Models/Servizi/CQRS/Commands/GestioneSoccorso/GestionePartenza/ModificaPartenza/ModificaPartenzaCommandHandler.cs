using CQRS.Commands;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Classi.Soccorso.Eventi.Partenze;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.AggiornaStatoMezzo;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.AnnullaPartenza;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using System;
using System.Linq;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.ModificaPartenza
{
    public class ModificaPartenzaCommandHandler : ICommandHandler<ModificaPartenzaCommand>
    {
        private readonly IGetRichiestaById _getRichiestaById;
        private readonly IUpDateRichiestaAssistenza _upDateRichiestaAssistenza;
        private readonly IUpdateStatoPartenze _updateStatoPartenze;

        private RichiestaAssistenza Richiesta;

        public ModificaPartenzaCommandHandler(
            IGetRichiestaById getRichiestaById,
            IUpDateRichiestaAssistenza upDateRichiestaAssistenza,
            IUpdateStatoPartenze updateStatoPartenze
        )
        {
            Richiesta = new RichiestaAssistenza();
            _getRichiestaById = getRichiestaById;
            _upDateRichiestaAssistenza = upDateRichiestaAssistenza;
            _updateStatoPartenze = updateStatoPartenze;
        }

        public void Handle(ModificaPartenzaCommand command)
        {
            //ANNULLO PARTENZA
            AnnullaPartenza(new AnnullaPartenzaCommand()
            {
                IdOperatore = command.IdOperatore,
                IdRichiesta = command.CodRichiesta,
                TestoMotivazione = command.Motivazione,
                TargaMezzo = command.CodMezzo.Split(".")[1]
            }, command.DataAnnullamento);

            //NUOVA PARTENZA


            //TRADUCO GLI EVENTI
            //foreach (var evento in command.lstEventi.OrderBy(c => c.Istante))
            //{
            //    switch (evento.TipoEvento)
            //    {
            //        default:
            //            break;
            //    }
            //}
        }

        private void AnnullaPartenza(AnnullaPartenzaCommand command, DateTime data)
        {
            Richiesta = _getRichiestaById.GetById(command.IdRichiesta);

            var PartenzaToDelete = Richiesta.Partenze.Where(x => x.Partenza.Mezzo.Codice.Equals(command.TargaMezzo)).FirstOrDefault();
            
            new RevocaPerAltraMotivazione(Richiesta, command.TargaMezzo, data, command.IdOperatore, command.TestoMotivazione);
            
            _upDateRichiestaAssistenza.UpDate(Richiesta);

            AggiornaStatoMezzoCommand commandStatoMezzo = new AggiornaStatoMezzoCommand()
            {
                CodiceSede = PartenzaToDelete.Partenza.Mezzo.Distaccamento.Codice,
                IdMezzo = command.TargaMezzo,
                StatoMezzo = Costanti.MezzoInSede,
                Richiesta = Richiesta
            };

            _updateStatoPartenze.Update(commandStatoMezzo);
        }
    }
    
}
