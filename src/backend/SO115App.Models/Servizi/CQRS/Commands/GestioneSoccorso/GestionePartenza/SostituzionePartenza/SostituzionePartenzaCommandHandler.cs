using CQRS.Commands;
using SO115App.API.Models.Classi.Soccorso.Eventi.Partenze;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Classi.ServiziEsterni.Gac;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using System.Linq;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.SostituzionePartenza
{
    public class SostituzionePartenzaCommandHandler : ICommandHandler<SostituzionePartenzaCommand>
    {
        private readonly IUpDateRichiestaAssistenza _updateRichiesta;
        private readonly ISetRientroMezzo _rientroMezzo;
        private readonly ISetUscitaMezzo _uscitaMezzo;
        private readonly ISostituzionePartenza _sostituzionePartenza;

        public SostituzionePartenzaCommandHandler(IUpDateRichiestaAssistenza updateRichiesta, ISetRientroMezzo rientroMezzo)
        {
            _updateRichiesta = updateRichiesta;
            _rientroMezzo = rientroMezzo;
        }

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

                new SostituzionePartenzaFineTurno(Richiesta, sostituzione.CodMezzoSmontante, command.sostituzione.DataOraOperazione, command.sostituzione.idOperatore, Note);

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

                #endregion

                #region Comunicazione a servizi GAC

                //RIENTRO
                _rientroMezzo.Set(new RientroGAC()
                { 
                    //nuovo id partenza
                    idPartenza = appoPartenzaMontante.Partenza.Codice.ToString(),
                    dataIntervento = appoPartenzaSmontante.DataOraInserimento,
                    numeroIntervento = appoPartenzaSmontante.CodiceRichiesta,
                    dataRientro = appoPartenzaSmontante.DataOraInserimento,
                    targa = appoPartenzaSmontante.Partenza.Mezzo.Codice,
                    tipoMezzo = appoPartenzaSmontante.Partenza.Mezzo.Genere
                });

                //USCITA

                #endregion

                var CodSede = appoPartenzaSmontante.Partenza.Mezzo.Distaccamento.Codice;

                _updateRichiesta.UpDate(Richiesta);
            }
        }
    }
}
