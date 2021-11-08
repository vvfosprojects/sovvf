using CQRS.Commands;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Soccorso.Eventi.Partenze;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Classi.Soccorso.Eventi.Partenze;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.AggiornaStatoMezzo;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Statri;
using System.Linq;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.ModificaPartenza
{
    public class ModificaPartenzaCommandHandler : ICommandHandler<ModificaPartenzaCommand>
    {
        private readonly IUpdateStatoPartenze _updateStatoPartenze;
        private readonly ISendSTATRIItem _sendNewItemSTATRI;
        private readonly ICheckCongruitaPartenze _checkCongruita;

        public ModificaPartenzaCommandHandler(IUpdateStatoPartenze updateStatoPartenze, ISendSTATRIItem sendNewItemSTATRI,
                                              ICheckCongruitaPartenze checkCongruita)
        {
            _updateStatoPartenze = updateStatoPartenze;
            _sendNewItemSTATRI = sendNewItemSTATRI;
            _checkCongruita = checkCongruita;
        }

        public void Handle(ModificaPartenzaCommand command)
        {
            var Richiesta = command.Richiesta;

            foreach (CambioStatoMezzo stato in command.ModificaPartenza.SequenzaStati)
                stato.CodMezzo = command.ModificaPartenza.Mezzo.Codice;

            //ANNULLAMENTO E COMPOSIZIONE ---
            if (command.ModificaPartenza.Annullamento)
            {
                //ANNULLAMENTO ---
                var partenzaDaAnnullare = command.Richiesta.Partenze.FirstOrDefault(p => p.Partenza.Mezzo.Codice.Equals(command.ModificaPartenza.CodMezzoDaAnnullare));

                new RevocaPerSostituzioneMezzo(Richiesta, command.ModificaPartenza.CodMezzoDaAnnullare, command.ModificaPartenza.DataAnnullamento.Value, command.IdOperatore, command.ModificaPartenza.MotivazioneAnnullamento, partenzaDaAnnullare.Partenza.Codice);

                partenzaDaAnnullare.Partenza.PartenzaAnnullata = true;
                partenzaDaAnnullare.Partenza.Mezzo.Stato = Costanti.MezzoRientrato;

                _updateStatoPartenze.Update(new AggiornaStatoMezzoCommand()
                {
                    CodiciSede = command.CodSede,
                    CodRichiesta = Richiesta.CodRichiesta,
                    Richiesta = Richiesta,
                    IdUtente = command.IdOperatore,
                    IdMezzo = partenzaDaAnnullare.Partenza.Mezzo.Codice,
                    DataOraAggiornamento = command.ModificaPartenza.DataAnnullamento.Value,
                    StatoMezzo = partenzaDaAnnullare.Partenza.Mezzo.Stato
                });

                //COMPOSIZIONE ---
                var dataComposizione = command.Richiesta.Eventi.Max(c => c.Istante).AddMilliseconds(1);

                var nuovaPartenza = new ComposizionePartenze(Richiesta, dataComposizione, command.IdOperatore, false, new Partenza()
                {
                    Mezzo = command.ModificaPartenza.Mezzo,
                    Squadre = command.ModificaPartenza.Squadre,
                    Sganciata = false
                });

                nuovaPartenza.Partenza.Mezzo.Stato = Costanti.MezzoInUscita;
                foreach (var squadra in nuovaPartenza.Partenza.Squadre)
                    squadra.Stato = MappaStatoSquadraDaStatoMezzo.MappaStato(nuovaPartenza.Partenza.Mezzo.Stato);

                _updateStatoPartenze.Update(new AggiornaStatoMezzoCommand()
                {
                    CodiciSede = command.CodSede,
                    CodRichiesta = Richiesta.CodRichiesta,
                    Richiesta = Richiesta,
                    IdUtente = command.IdOperatore,
                    IdMezzo = nuovaPartenza.Partenza.Mezzo.Codice,
                    DataOraAggiornamento = command.ModificaPartenza.DataAnnullamento.Value,
                    StatoMezzo = nuovaPartenza.Partenza.Mezzo.Stato
                });
            }

            //AGGIORNAMENTO STATO ---
            if (command.ModificaPartenza.SequenzaStati != null && command.ModificaPartenza.SequenzaStati.Where(c => c.CodMezzo != command.ModificaPartenza.CodMezzoDaAnnullare).Count() > 0)
            {
                var partenzaDaLavorare = Richiesta.Partenze
                    .OrderByDescending(p => p.Istante)
                    .FirstOrDefault(p => p.Partenza.Mezzo.Codice.Equals(command.ModificaPartenza.SequenzaStati.Select(s => s.CodMezzo).FirstOrDefault()));

                foreach (var stato in command.ModificaPartenza.SequenzaStati.Where(c => c.CodMezzo != command.ModificaPartenza.CodMezzoDaAnnullare).OrderBy(c => c.Istante))
                {
                    Richiesta.CambiaStatoPartenza(partenzaDaLavorare.Partenza, stato, _sendNewItemSTATRI, _checkCongruita);

                    _updateStatoPartenze.Update(new AggiornaStatoMezzoCommand()
                    {
                        CodiciSede = command.CodSede,
                        CodRichiesta = Richiesta.CodRichiesta,
                        Richiesta = Richiesta,
                        IdUtente = command.IdOperatore,
                        IdMezzo = stato.CodMezzo,
                        DataOraAggiornamento = stato.Istante,
                        StatoMezzo = stato.Stato
                    });
                }
            }
        }
    }
}
