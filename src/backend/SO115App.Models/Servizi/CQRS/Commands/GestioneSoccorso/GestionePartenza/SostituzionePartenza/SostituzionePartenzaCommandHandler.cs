using CQRS.Commands;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Soccorso.Eventi.Partenze;
using SO115App.Models.Classi.Soccorso.Eventi.Partenze;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.AggiornaStatoMezzo;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using System.Linq;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.SostituzionePartenza
{
    public class SostituzionePartenzaCommandHandler : ICommandHandler<SostituzionePartenzaCommand>
    {
        private readonly IUpdateStatoPartenze _updateStatoPartenze;

        public SostituzionePartenzaCommandHandler(IUpdateStatoPartenze updateStatoPartenze) => _updateStatoPartenze = updateStatoPartenze;

        public void Handle(SostituzionePartenzaCommand command)
        {
            var Richiesta = command.Richiesta;

            foreach (var sostituzione in command.sostituzione.Sostituzioni)
            {
                string NoteSquadreSmontanti = "";
                string NoteSquadreMontanti = "";
                if (sostituzione.SquadreSmontanti.Count > 1)
                {
                    foreach (var squadra in sostituzione.SquadreSmontanti)
                    {
                        NoteSquadreSmontanti = NoteSquadreSmontanti + squadra + ",";
                    }

                    NoteSquadreSmontanti = "Le squadre " + NoteSquadreSmontanti.Substring(0, NoteSquadreSmontanti.Length - 1) + " vengono sostituite ";
                }
                else NoteSquadreSmontanti = "La squadra " + sostituzione.SquadreSmontanti[0] + " viene sostituita ";

                if (sostituzione.SquadreMontanti.Count > 1)
                {
                    foreach (var squadra in sostituzione.SquadreMontanti)
                    {
                        NoteSquadreMontanti = NoteSquadreMontanti + squadra + ",";
                    }

                    NoteSquadreMontanti = " dalle squadre " + NoteSquadreMontanti.Substring(0, NoteSquadreMontanti.Length - 1);
                }
                else NoteSquadreMontanti = " dalla squadra " + sostituzione.SquadreMontanti[0];

                string Note = NoteSquadreSmontanti + NoteSquadreMontanti + " sul mezzo " + sostituzione.CodMezzoSmontante;

                var EventoPartenza = new SostituzionePartenzaFineTurno(Richiesta, sostituzione.CodMezzoSmontante, command.sostituzione.DataOraOperazione, command.sostituzione.idOperatore, Note);

                #region Aggiornamento Partenze nella Richiesta

                var appoPartenzaSmontante = Richiesta.Partenze.FirstOrDefault(x => x.Partenza.Squadre.Equals(command.sostituzione.Sostituzioni[0].CodMezzoSmontante));
                var appoPartenzaMontante = Richiesta.Partenze.FirstOrDefault(x => x.Partenza.Squadre.Equals(command.sostituzione.Sostituzioni[0].CodMezzoMontante));

                //SPET 1 - Rimuovo la partenza smontante originale
                Richiesta.Partenze.Remove(appoPartenzaSmontante);
                //SPET 2 - Aggiungo la partenza smontante indicando che è terminata
                appoPartenzaSmontante.Partenza.Terminata = true;
                Richiesta.Partenze.Add(appoPartenzaSmontante);
                //SPET 3 - Aggiungo la partenza smontante nuova con la nuova squadra montante
                appoPartenzaSmontante.Partenza.Squadre = appoPartenzaMontante.Partenza.Squadre;
                appoPartenzaSmontante.Partenza.Terminata = false;
                Richiesta.Partenze.Add(appoPartenzaSmontante);

                //SPET 4 - Rimuovo la partenza montante originale
                Richiesta.Partenze.Remove(appoPartenzaMontante);
                //SPET 5 - Aggiungo la partenza Montante indicando che è terminata
                appoPartenzaMontante.Partenza.Terminata = true;
                Richiesta.Partenze.Add(appoPartenzaMontante);
                //SPET 6 - Aggiungo la partenza Montante nuova con la squadra smontante
                appoPartenzaMontante.Partenza.Squadre = appoPartenzaSmontante.Partenza.Squadre;
                appoPartenzaMontante.Partenza.Terminata = false;
                Richiesta.Partenze.Add(appoPartenzaMontante);

                #endregion Aggiornamento Partenze nella Richiesta

                _updateStatoPartenze.Update(new AggiornaStatoMezzoCommand()
                {
                    CodiceSede = Richiesta.Partenze.FirstOrDefault(x => x.Partenza.Squadre.Equals(sostituzione.CodMezzoMontante)).Partenza.Mezzo.Distaccamento.Codice,
                    CodRichiesta = Richiesta.Codice,
                    Richiesta = Richiesta,
                    IdUtente = command.sostituzione.idOperatore,
                    DataOraAggiornamento = command.sostituzione.DataOraOperazione,
                    StatoMezzo = "SulPosto",
                    IdMezzo = sostituzione.CodMezzoSmontante
                });

                _updateStatoPartenze.Update(new AggiornaStatoMezzoCommand()
                {
                    CodiceSede = Richiesta.Partenze.FirstOrDefault(x => x.Partenza.Squadre.Equals(sostituzione.CodMezzoMontante)).Partenza.Mezzo.Distaccamento.Codice,
                    CodRichiesta = Richiesta.Codice,
                    Richiesta = Richiesta,
                    IdUtente = command.sostituzione.idOperatore,
                    DataOraAggiornamento = command.sostituzione.DataOraOperazione,
                    StatoMezzo = "SulPosto",
                    IdMezzo = sostituzione.CodMezzoMontante
                });
            }
        }
    }
}
