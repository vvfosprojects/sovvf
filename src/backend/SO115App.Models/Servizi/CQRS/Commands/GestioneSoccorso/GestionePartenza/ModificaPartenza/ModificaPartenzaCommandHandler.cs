using CQRS.Commands;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Soccorso.Eventi.Partenze;
using SO115App.Models.Classi.Soccorso.Eventi.Partenze;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.AggiornaStatoMezzo;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using System.Linq;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.ModificaPartenza
{
    public class ModificaPartenzaCommandHandler : ICommandHandler<ModificaPartenzaCommand>
    {
        private readonly IUpdateStatoPartenze _updateStatoPartenze;
        private ModificaPartenzaCommandHandler() { }
        public ModificaPartenzaCommandHandler(IUpdateStatoPartenze updateStatoPartenze) => _updateStatoPartenze = updateStatoPartenze;

        public void Handle(ModificaPartenzaCommand command)
        {
            var Richiesta = command.Richiesta;

            //ANNULLAMENTO E COMPOSIZIONE ---
            if (command.ModificaPartenza.Annullamento)
            {
                //ANNULLAMENTO ---
                var partenzaDaAnnullare = command.Richiesta.Partenze.FirstOrDefault(p => p.Partenza.Mezzo.Codice.Equals(command.ModificaPartenza.CodMezzoDaAnnullare));

                new RevocaPerSostituzioneMezzo(Richiesta, command.ModificaPartenza.CodMezzoDaAnnullare, command.ModificaPartenza.DataAnnullamento.Value, command.IdOperatore, command.ModificaPartenza.MotivazioneAnnullamento);

                partenzaDaAnnullare.PartenzaAnnullata = true;
                partenzaDaAnnullare.Partenza.PartenzaAnnullata = true;
                partenzaDaAnnullare.Partenza.Mezzo.Stato = Costanti.MezzoInSede;

                _updateStatoPartenze.Update(new AggiornaStatoMezzoCommand()
                {
                    CodiceSede = command.CodSede,
                    CodRichiesta = Richiesta.CodRichiesta,
                    Richiesta = Richiesta,
                    IdUtente = command.IdOperatore,
                    IdMezzo = partenzaDaAnnullare.Partenza.Mezzo.Codice,
                    DataOraAggiornamento = command.ModificaPartenza.DataAnnullamento.Value,
                    StatoMezzo = partenzaDaAnnullare.Partenza.Mezzo.Stato
                });

                //COMPOSIZIONE ---
                var dataComposizione = command.Richiesta.Eventi.Max(c => c.Istante).AddMilliseconds(1);

                var nuovaPartenza = new ComposizionePartenze(Richiesta, dataComposizione, command.IdOperatore, false)
                {
                    Partenza = new Partenza()
                    {
                        Mezzo = command.ModificaPartenza.Mezzo,
                        Squadre = command.ModificaPartenza.Squadre,
                        Sganciata = false
                    }
                };

                nuovaPartenza.Partenza.Mezzo.Stato = Costanti.MezzoInUscita;

                _updateStatoPartenze.Update(new AggiornaStatoMezzoCommand()
                {
                    CodiceSede = command.CodSede,
                    CodRichiesta = Richiesta.CodRichiesta,
                    Richiesta = Richiesta,
                    IdUtente = command.IdOperatore,
                    IdMezzo = nuovaPartenza.Partenza.Mezzo.Codice,
                    DataOraAggiornamento = command.ModificaPartenza.DataAnnullamento.Value,
                    StatoMezzo = nuovaPartenza.Partenza.Mezzo.Stato
                });
            }

            //AGGIORNAMENTO STATO ---
            if (command.ModificaPartenza.SequenzaStati != null && command.ModificaPartenza.SequenzaStati.Count > 0)
            {
                var partenzaDaLavorare = Richiesta.Partenze
                    .OrderByDescending(p => p.Istante)
                    .FirstOrDefault(p => p.Partenza.Mezzo.Codice.Equals(command.ModificaPartenza.SequenzaStati.Select(s => s.CodMezzo).FirstOrDefault()));

                foreach (var stato in command.ModificaPartenza.SequenzaStati.OrderBy(c => c.DataOraAggiornamento))
                {
                    Richiesta.CambiaStatoPartenza(partenzaDaLavorare, stato);

                    _updateStatoPartenze.Update(new AggiornaStatoMezzoCommand()
                    {
                        CodiceSede = command.CodSede,
                        CodRichiesta = Richiesta.CodRichiesta,
                        Richiesta = Richiesta,
                        IdUtente = command.IdOperatore,
                        IdMezzo = stato.CodMezzo,
                        DataOraAggiornamento = stato.DataOraAggiornamento,
                        StatoMezzo = stato.Stato
                    });
                }
            }
        }
    }
}
