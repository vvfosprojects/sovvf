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
        private ComposizionePartenze PartenzaDaComporre;

        public ModificaPartenzaCommandHandler(
            IUpdateStatoPartenze updateStatoPartenze,
            IUpdateConfermaPartenze updateConfermaPartenze)
        {
            _updateStatoPartenze = updateStatoPartenze;
            _updateConfermaPartenze = updateConfermaPartenze;
        }

        public void Handle(ModificaPartenzaCommand command)
        {
            Richiesta = command.Richiesta;

            PartenzaDaAnnullare = Richiesta.Partenze
                .FirstOrDefault(c => c.Partenza.Mezzo.Codice.Equals(command.ModificaPartenza.CodMezzoDaAnnullare));

            //ANNULLO PARTENZA
            if (command.ModificaPartenza.Annullamento)
            {
                /*Richiesta = */AnnullaPartenza(new AnnullaPartenzaCommand()
                {
                    IdOperatore = command.IdOperatore,
                    IdRichiesta = command.Richiesta.Id,
                    TestoMotivazione = command.ModificaPartenza.MotivazioneAnnullamento,
                    TargaMezzo = command.ModificaPartenza.CodMezzoDaAnnullare,
                }, command.ModificaPartenza.DataAnnullamento.Value);
            }

            //NUOVA PARTENZA
            var dataComposizione = command.Richiesta.Eventi.Max(c => c.Istante).AddMilliseconds(1);
            /*Richiesta = */ComponiPartenza(new ConfermaPartenzeCommand()
            {
                ConfermaPartenze = new ConfermaPartenze()
                {
                    IdRichiesta = command.Richiesta.Id,
                    CodiceSede = command.CodSede,
                    IdOperatore = command.IdOperatore,
                    richiesta = Richiesta,
                    Partenze = Richiesta.Partenze.Select(c => c.Partenza).ToList()
                }
            }, dataComposizione, command.ModificaPartenza.Mezzo, command.ModificaPartenza.Squadre);

            //TRADUCO GLI STATI
            foreach (var stato in command.ModificaPartenza.SequenzaStati.OrderBy(c => c.DataOraAggiornamento))
            {
                /*Richiesta = */AggiornaStato(new AggiornaStatoMezzoCommand()
                {
                    Richiesta = Richiesta,
                    CodiceSede = command.CodSede,
                    IdUtente = command.IdOperatore,
                    CodRichiesta = Richiesta.CodRichiesta,
                    DataOraAggiornamento = stato.DataOraAggiornamento,
                    StatoMezzo = stato.Stato,
                    IdMezzo = PartenzaDaComporre.Partenza.Mezzo.Codice
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

            //return Richiesta;

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

            //Richiesta.SincronizzaStatoRichiesta(Costanti.RichiestaAssegnata, Richiesta.StatoRichiesta, command.ConfermaPartenze.IdOperatore, "", data);

            PartenzaDaComporre = Richiesta.Partenze.FirstOrDefault(c => c.Partenza.Mezzo.Codice.Equals(mezzo.Codice));

            PartenzaDaComporre.Partenza.Mezzo.Stato = Costanti.MezzoInUscita;
            foreach (var squadra in PartenzaDaComporre.Partenza.Squadre)
            {
                squadra.Stato = MappaStatoSquadraDaStatoMezzo.MappaStato(PartenzaDaComporre.Partenza.Mezzo.Stato);
            }

            command.ConfermaPartenze.Partenze.Add(PartenzaDaComporre.Partenza);

            //return Richiesta;

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

                PartenzaDaComporre.Partenza.Mezzo.Stato = Costanti.MezzoInViaggio;
                PartenzaDaComporre.Partenza.Mezzo.IdRichiesta = Richiesta.CodRichiesta;
            }
            else if (command.StatoMezzo == Costanti.MezzoSulPosto)
            {
                new ArrivoSulPosto(Richiesta, command.IdMezzo, command.DataOraAggiornamento, Richiesta.CodOperatore);

                Richiesta.SincronizzaStatoRichiesta(Costanti.RichiestaPresidiata, Richiesta.StatoRichiesta,
                    Richiesta.CodOperatore, "", command.DataOraAggiornamento);

                PartenzaDaComporre.Partenza.Mezzo.Stato = Costanti.MezzoSulPosto;
                PartenzaDaComporre.Partenza.Mezzo.IdRichiesta = Richiesta.CodRichiesta;
            }
            else if (command.StatoMezzo == Costanti.MezzoInRientro)
            {
                PartenzaDaComporre.Partenza.Mezzo.Stato = Costanti.MezzoInRientro;
                PartenzaDaComporre.Partenza.Mezzo.IdRichiesta = null;
                PartenzaDaComporre.Partenza.Terminata = true;

                new PartenzaInRientro(Richiesta, command.IdMezzo, command.DataOraAggiornamento, Richiesta.CodOperatore);
            }
            else if (command.StatoMezzo == Costanti.MezzoRientrato)
            {
                if (!PartenzaDaComporre.Partenza.Terminata)
                {
                    PartenzaDaComporre.Partenza.Mezzo.Stato = Costanti.MezzoInSede;
                    PartenzaDaComporre.Partenza.Mezzo.IdRichiesta = null;
                    PartenzaDaComporre.Partenza.Terminata = true;
                }

                if (PartenzaDaComporre.Partenza.Mezzo.Stato != Costanti.MezzoInSede
                    && PartenzaDaComporre.Partenza.Mezzo.Stato != Costanti.MezzoInUscita
                    && PartenzaDaComporre.Partenza.Mezzo.Stato != Costanti.MezzoRientrato)
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
                PartenzaDaComporre.Partenza.Mezzo.Stato = Costanti.MezzoInViaggio;
                PartenzaDaComporre.Partenza.Mezzo.IdRichiesta = Richiesta.CodRichiesta;
            }

            #endregion Switch StatoMezzo

            if (_mezziTuttiInSede && Richiesta.StatoRichiesta is Sospesa)
            {
                new ChiusuraRichiesta("", Richiesta, command.DataOraAggiornamento, Richiesta.CodOperatore);
            }

            foreach (var squadra in PartenzaDaComporre.Partenza.Squadre)
            {
                squadra.Stato = MappaStatoSquadraDaStatoMezzo.MappaStato(command.StatoMezzo);
            }

            command.Richiesta = Richiesta;

            //return Richiesta;

            _updateStatoPartenze.Update(command);
        }
    }
}
