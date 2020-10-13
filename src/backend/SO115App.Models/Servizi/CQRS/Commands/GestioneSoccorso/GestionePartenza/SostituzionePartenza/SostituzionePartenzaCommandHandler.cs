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
                        NoteSquadreSmontanti = NoteSquadreSmontanti + squadra.Id + ",";
                    }

                    NoteSquadreSmontanti = "Le squadre " + NoteSquadreSmontanti.Substring(0, NoteSquadreSmontanti.Length - 1) + " vengono sostituite ";
                }
                else NoteSquadreSmontanti = "La squadra " + sostituzione.SquadreSmontanti[0].Id + " viene sostituita ";

                if (sostituzione.SquadreMontanti.Count > 1)
                {
                    foreach (var squadra in sostituzione.SquadreMontanti)
                    {
                        NoteSquadreMontanti = NoteSquadreMontanti + squadra.Id + ",";
                    }

                    NoteSquadreMontanti = " dalle squadre " + NoteSquadreMontanti.Substring(0, NoteSquadreMontanti.Length - 1);
                }
                else NoteSquadreMontanti = " dalla squadra " + sostituzione.SquadreMontanti[0].Id;

                string Note = NoteSquadreSmontanti + NoteSquadreMontanti + " sul mezzo " + sostituzione.IdMezzo;

                var EventoPartenza = new SostituzionePartenzaFineTurno(Richiesta, sostituzione.IdMezzo, command.sostituzione.DataOraOperazione, command.sostituzione.idOperatore, Note);

                var appoPartenza = Richiesta.Partenze.FirstOrDefault(x => x.Partenza.Squadre.Equals(command.sostituzione.Sostituzioni[0].IdMezzo));
                Richiesta.Partenze.Remove(appoPartenza);

                appoPartenza.Partenza.Squadre = sostituzione.SquadreMontanti;
                Richiesta.Partenze.Add(appoPartenza);

                _updateStatoPartenze.Update(new AggiornaStatoMezzoCommand()
                {
                    CodiceSede = Richiesta.Partenze.FirstOrDefault(x => x.Partenza.Squadre.Equals(sostituzione.IdMezzo)).Partenza.Mezzo.Distaccamento.Codice,
                    CodRichiesta = Richiesta.Codice,
                    Richiesta = Richiesta,
                    IdUtente = command.sostituzione.idOperatore,
                    DataOraAggiornamento = command.sostituzione.DataOraOperazione,
                    StatoMezzo = "SulPosto",
                    IdMezzo = sostituzione.IdMezzo
                });
            }
        }
    }
}
