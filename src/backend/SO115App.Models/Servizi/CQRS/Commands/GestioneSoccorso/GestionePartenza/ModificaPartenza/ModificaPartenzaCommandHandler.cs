using CQRS.Commands;
using DomainModel.CQRS.Commands.ConfermaPartenze;
using SO115App.API.Models.Classi.Composizione;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Classi.Soccorso.Eventi;
using SO115App.API.Models.Classi.Soccorso.Eventi.Partenze;
using SO115App.API.Models.Classi.Soccorso.StatiRichiesta;
using SO115App.Models.Classi.Soccorso.Eventi.Partenze;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.AggiornaStatoMezzo;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.AnnullaPartenza;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using System;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.ModificaPartenza
{
    public class ModificaPartenzaCommandHandler : ICommandHandler<ModificaPartenzaCommand>
    {
        private readonly IUpdateStatoPartenze _updateStatoPartenze;
        private readonly IUpdateConfermaPartenze _updateConfermaPartenze;

        private RichiestaAssistenza Richiesta;
        private ComposizionePartenze PartenzaDaAnnullare;
        private ComposizionePartenze NuovaPartenza;

        public ModificaPartenzaCommandHandler(
            IUpdateStatoPartenze updateStatoPartenze,
            IUpdateConfermaPartenze updateConfermaPartenze)
        {
            _updateStatoPartenze = updateStatoPartenze;
            _updateConfermaPartenze = updateConfermaPartenze;
        }

        public void Handle(ModificaPartenzaCommand command)
        {
            //TODO RAGIONARE CON COD RICHIESTA NON ID

            Richiesta = command.Richiesta;

            PartenzaDaAnnullare = Richiesta.Partenze
                .FirstOrDefault(c => c.Partenza.Mezzo.Codice.Equals(command.ModificaPartenza.CodMezzoDaAnnullare));

            //ANNULLO PARTENZA
            if (command.ModificaPartenza.Annullamento)
            {
                AnnullaPartenza(new AnnullaPartenzaCommand()
                {
                    IdOperatore = command.IdOperatore,
                    IdRichiesta = command.ModificaPartenza.CodRichiesta,
                    TestoMotivazione = command.ModificaPartenza.MotivazioneAnnullamento,
                    TargaMezzo = command.ModificaPartenza.CodMezzoDaAnnullare,
                }, command.ModificaPartenza.DataAnnullamento.Value);
            }

            //NUOVA PARTENZA
            ComponiPartenza(new ConfermaPartenzeCommand()
            {
                ConfermaPartenze = new ConfermaPartenze()
                {
                    IdRichiesta = command.ModificaPartenza.CodRichiesta,
                    CodiceSede = command.CodSede,
                    IdOperatore = command.IdOperatore,
                    richiesta = Richiesta,
                    Partenze = Richiesta.Partenze.Select(c => c.Partenza).ToList()
                }
            }, command.DataPrimoStato, command.ModificaPartenza.Mezzo, command.ModificaPartenza.Squadre);

            //TRADUCO GLI STATI
            foreach (var stato in command.ModificaPartenza.SequenzaStati.OrderBy(c => c.DataOraAggiornamento))
            {
                AggiornaStato(new AggiornaStatoMezzoCommand()
                {
                    Richiesta = Richiesta,
                    CodiceSede = command.CodSede,
                    IdUtente = command.IdOperatore,
                    CodRichiesta = Richiesta.CodRichiesta,
                    DataOraAggiornamento = stato.DataOraAggiornamento,
                    StatoMezzo = stato.Stato,
                    IdMezzo = NuovaPartenza.Partenza.Mezzo.Codice
                });
            }

            //Preparo dati per notifica
            command.Richiesta = Richiesta;
        }

        private void AnnullaPartenza(AnnullaPartenzaCommand command, DateTime data)
        {
            //GESTISCO RICHIESTA
            new RevocaPerSostituzioneMezzo(Richiesta, command.TargaMezzo, data, command.IdOperatore, command.TestoMotivazione);

            PartenzaDaAnnullare.PartenzaAnnullata = true;
            PartenzaDaAnnullare.Partenza.PartenzaAnnullata = true;
            PartenzaDaAnnullare.Partenza.Mezzo.Stato = Costanti.MezzoInRientro;

            foreach (var squadra in PartenzaDaAnnullare.Partenza.Squadre)
            {
                squadra.Stato = MappaStatoSquadraDaStatoMezzo.MappaStato(PartenzaDaAnnullare.Partenza.Mezzo.Stato);
            }

            //GESTISCO STATO MEZZI E SQUADRE
            var commandStatoMezzo = new AggiornaStatoMezzoCommand()
            {
                CodiceSede = PartenzaDaAnnullare.Partenza.Mezzo.Distaccamento.Codice,
                IdMezzo = command.TargaMezzo,
                StatoMezzo = Costanti.MezzoInRientro,
                Richiesta = Richiesta,
                IdUtente = command.IdOperatore
            };

            _updateStatoPartenze.Update(commandStatoMezzo);            
        }

        private void ComponiPartenza(ConfermaPartenzeCommand command, DateTime data, Mezzo mezzo, List<Squadra> squadre)
        {
            new ComposizionePartenze(Richiesta, data, command.ConfermaPartenze.IdOperatore, false)
            {
                Partenza = new Partenza()
                {
                    Mezzo = mezzo,
                    Squadre = squadre,
                    Sganciata = false
                }
            };

            Richiesta.SincronizzaStatoRichiesta(Costanti.RichiestaAssegnata, Richiesta.StatoRichiesta, command.ConfermaPartenze.IdOperatore, "", data);

            NuovaPartenza = Richiesta.Partenze.FirstOrDefault(c => c.Partenza.Mezzo.Codice.Equals(mezzo.Codice));

            NuovaPartenza.Partenza.Mezzo.Stato = Costanti.MezzoInUscita;
            foreach (var squadra in NuovaPartenza.Partenza.Squadre)
            {
                squadra.Stato = MappaStatoSquadraDaStatoMezzo.MappaStato(NuovaPartenza.Partenza.Mezzo.Stato);
            }

            command.ConfermaPartenze.Partenze.Add(NuovaPartenza.Partenza);

            _updateConfermaPartenze.Update(command);
        }

        private void AggiornaStato(AggiornaStatoMezzoCommand command)
        {
            bool _mezziTuttiInSede = true;

            #region Switch StatoMezzo

            if (command.StatoMezzo == Costanti.MezzoInViaggio)
            {
                new UscitaPartenza(Richiesta, command.IdMezzo, command.DataOraAggiornamento, Richiesta.CodOperatore);

                Richiesta.SincronizzaStatoRichiesta(Costanti.RichiestaAssegnata, Richiesta.StatoRichiesta,
                    Richiesta.CodOperatore, "", command.DataOraAggiornamento);

                NuovaPartenza.Partenza.Mezzo.Stato = Costanti.MezzoInViaggio;
                NuovaPartenza.Partenza.Mezzo.IdRichiesta = Richiesta.CodRichiesta;
            }
            else if (command.StatoMezzo == Costanti.MezzoSulPosto)
            {
                new ArrivoSulPosto(Richiesta, command.IdMezzo, command.DataOraAggiornamento, Richiesta.CodOperatore);

                Richiesta.SincronizzaStatoRichiesta(Costanti.RichiestaPresidiata, Richiesta.StatoRichiesta,
                    Richiesta.CodOperatore, "", command.DataOraAggiornamento);

                NuovaPartenza.Partenza.Mezzo.Stato = Costanti.MezzoSulPosto;
                NuovaPartenza.Partenza.Mezzo.IdRichiesta = Richiesta.CodRichiesta;
            }
            else if (command.StatoMezzo == Costanti.MezzoInRientro)
            {
                NuovaPartenza.Partenza.Mezzo.Stato = Costanti.MezzoInRientro;
                NuovaPartenza.Partenza.Mezzo.IdRichiesta = null;
                NuovaPartenza.Partenza.Terminata = true;

                new PartenzaInRientro(Richiesta, command.IdMezzo, command.DataOraAggiornamento, Richiesta.CodOperatore);
            }
            else if (command.StatoMezzo == Costanti.MezzoRientrato)
            {
                if (!NuovaPartenza.Partenza.Terminata)
                {
                    NuovaPartenza.Partenza.Mezzo.Stato = Costanti.MezzoInSede;
                    NuovaPartenza.Partenza.Mezzo.IdRichiesta = null;
                    NuovaPartenza.Partenza.Terminata = true;
                }

                if (NuovaPartenza.Partenza.Mezzo.Stato != Costanti.MezzoInSede
                    && NuovaPartenza.Partenza.Mezzo.Stato != Costanti.MezzoInUscita
                    && NuovaPartenza.Partenza.Mezzo.Stato != Costanti.MezzoRientrato)
                {
                    _mezziTuttiInSede = false;
                }

                if (_mezziTuttiInSede)
                {
                    new PartenzaRientrata(Richiesta, command.IdMezzo, command.DataOraAggiornamento, Richiesta.CodOperatore);
                }
            }
            else if (command.StatoMezzo == Costanti.MezzoInViaggio)
            {
                NuovaPartenza.Partenza.Mezzo.Stato = Costanti.MezzoInViaggio;
                NuovaPartenza.Partenza.Mezzo.IdRichiesta = Richiesta.CodRichiesta;
            }

            #endregion

            if (_mezziTuttiInSede && Richiesta.StatoRichiesta is Sospesa)
            {
                new ChiusuraRichiesta("", Richiesta, command.DataOraAggiornamento, Richiesta.CodOperatore);
            }

            foreach (var squadra in NuovaPartenza.Partenza.Squadre)
            {
                squadra.Stato = MappaStatoSquadraDaStatoMezzo.MappaStato(command.StatoMezzo);
            }

            command.Richiesta = Richiesta;

            _updateStatoPartenze.Update(command);
        }
    }
}
