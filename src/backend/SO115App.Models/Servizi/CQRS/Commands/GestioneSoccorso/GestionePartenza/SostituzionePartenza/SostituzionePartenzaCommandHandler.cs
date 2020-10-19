using CQRS.Commands;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Soccorso.Eventi.Partenze;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Classi.Soccorso.Eventi.Partenze;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.AggiornaStatoMezzo;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using System;
using System.Linq;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.SostituzionePartenza
{
    public class SostituzionePartenzaCommandHandler : ICommandHandler<SostituzionePartenzaCommand>
    {
        private readonly IUpDateRichiestaAssistenza _updateRichiesta;

        public SostituzionePartenzaCommandHandler(IUpDateRichiestaAssistenza updateRichiesta) => _updateRichiesta = updateRichiesta;

        public void Handle(SostituzionePartenzaCommand command)
        {
            var Richiesta = command.Richiesta;

            foreach (var sostituzione in command.sostituzione.Sostituzioni)
            {
                string NoteSquadreSmontanti = "";
                string NoteSquadreMontanti = "";
                if (sostituzione.SquadreSmontanti.Count() > 1)
                {
                    foreach (var squadra in sostituzione.SquadreSmontanti)
                    {
                        NoteSquadreSmontanti = NoteSquadreSmontanti + squadra + ",";
                    }

                    NoteSquadreSmontanti = "Le squadre " + NoteSquadreSmontanti.Substring(0, NoteSquadreSmontanti.Length - 1) + " vengono sostituite ";
                }
                else NoteSquadreSmontanti = "La squadra " + sostituzione.SquadreSmontanti[0] + " viene sostituita ";

                if (sostituzione.SquadreMontanti.Count() > 1)
                {
                    foreach (var squadra in sostituzione.SquadreMontanti)
                    {
                        NoteSquadreMontanti = NoteSquadreMontanti + squadra + ",";
                    }

                    NoteSquadreMontanti = " dalle squadre " + NoteSquadreMontanti.Substring(0, NoteSquadreMontanti.Length - 1);
                }
                else NoteSquadreMontanti = " dalla squadra " + sostituzione.SquadreMontanti[0];

                string Note = NoteSquadreSmontanti + NoteSquadreMontanti + " sul mezzo " + sostituzione.CodMezzoSmontante + " tornando in sede con il mezzo " + sostituzione.CodMezzoMontante;

                var EventoPartenza = new SostituzionePartenzaFineTurno(Richiesta, sostituzione.CodMezzoSmontante, command.sostituzione.DataOraOperazione, command.sostituzione.idOperatore, Note);

                #region Aggiornamento Partenze nella Richiesta

                var appoPartenzaSmontante = Richiesta.Partenze.FirstOrDefault(x => x.Partenza.Mezzo.Codice.Equals(command.sostituzione.Sostituzioni[0].CodMezzoSmontante) && x.PartenzaAnnullata == false && x.Partenza.Terminata == false && x.Partenza.Sganciata == false);
                var appoPartenzaMontante = Richiesta.Partenze.FirstOrDefault(x => x.Partenza.Mezzo.Codice.Equals(command.sostituzione.Sostituzioni[0].CodMezzoMontante) && x.PartenzaAnnullata == false && x.Partenza.Terminata == false && x.Partenza.Sganciata == false);

                var BkSquadraMontante = appoPartenzaMontante.Partenza.Squadre;
                var BkSquadraSmontante = appoPartenzaSmontante.Partenza.Squadre;

                //SPET 2 - Aggiungo la partenza smontante indicando che è terminata
                appoPartenzaSmontante.Partenza.Squadre = BkSquadraMontante;

                Richiesta.Partenze.Add(appoPartenzaSmontante);

                //SPET 4 - Rimuovo la partenza montante originale
                appoPartenzaMontante.Partenza.Squadre = BkSquadraSmontante;
                Richiesta.Partenze.Add(appoPartenzaMontante);

                #endregion Aggiornamento Partenze nella Richiesta

                var CodSede = appoPartenzaSmontante.Partenza.Mezzo.Distaccamento.Codice;

                _updateRichiesta.UpDate(Richiesta);
            }
        }
    }
}
