using CQRS.Commands;
using DomainModel.CQRS.Commands.ConfermaPartenze;
using SO115App.API.Models.Classi.Autenticazione;
using SO115App.API.Models.Classi.Composizione;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Classi.Soccorso.Eventi;
using SO115App.API.Models.Classi.Soccorso.Eventi.Partenze;
using SO115App.API.Models.Classi.Soccorso.StatiRichiesta;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Classi.Soccorso;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.AggiornaStatoMezzo;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.AnnullaPartenza;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.GenerazioneCodiciRichiesta;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.Mezzi;
using SO115App.Models.Servizi.Infrastruttura.GestioneStatoOperativoSquadra;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti;
using System;
using System.Collections.Generic;
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
        private readonly IGeneraCodiceRichiesta _generaCodiceRichiesta;
        private readonly IGetUtenteById _getUtenteById;
        private readonly IGetStatoMezzi _getStatoMezzi;
        private readonly IUpdateConfermaPartenze _updateConfermaPartenze;

        private RichiestaAssistenza Richiesta;
        private Partenza Partenza;
        private Utente Utente;

        private bool _mezziTuttiInSede = true;

        public ModificaPartenzaCommandHandler(
            IGetRichiestaById getRichiestaById,
            IUpDateRichiestaAssistenza upDateRichiestaAssistenza,
            IUpdateStatoPartenze updateStatoPartenze,
            IUpDateRichiestaAssistenza updateRichiesta,
            ISetStatoOperativoMezzo setStatoOperativoMezzo,
            ISetStatoSquadra setStatoSquadra,
            IGeneraCodiceRichiesta generaCodiceRichiesta,
            IGetUtenteById getUtenteById,
            IGetStatoMezzi getStatoMezzi,
            IUpdateConfermaPartenze updateConfermaPartenze
        )
        {
            _getRichiestaById = getRichiestaById;
            _upDateRichiestaAssistenza = upDateRichiestaAssistenza;
            _updateStatoPartenze = updateStatoPartenze;
            _updateRichiesta = updateRichiesta;
            _setStatoOperativoMezzo = setStatoOperativoMezzo;
            _setStatoSquadra = setStatoSquadra;
            _generaCodiceRichiesta = generaCodiceRichiesta;
            _getStatoMezzi = getStatoMezzi;
            _getUtenteById = getUtenteById;
            _updateConfermaPartenze = updateConfermaPartenze;
        }

        public void Handle(ModificaPartenzaCommand command)
        {
            Richiesta = _getRichiestaById.GetById(command.ModificaPartenza.CodRichiesta);
            Utente = _getUtenteById.GetUtenteByCodice(command.IdOperatore);
            Partenza = Richiesta.Partenze.FirstOrDefault(c => c.Partenza.Mezzo.Codice == command.ModificaPartenza.CodMezzoDaAnnullare).Partenza;

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
            NuovaPartenza(new ConfermaPartenzeCommand()
            {
                ConfermaPartenze = new ConfermaPartenze()
                {
                    IdRichiesta = command.ModificaPartenza.CodRichiesta,
                    CodiceSede = command.CodSede,
                    IdOperatore = command.IdOperatore,
                    richiesta = Richiesta,
                    Partenze = Richiesta.Partenze.Select(c => c.Partenza).ToList()
                }
            }, command.ModificaPartenza.SequenzaStati
                .OrderBy(c => c.DataOraAggiornamento)
                .Select(c => c.DataOraAggiornamento)
                .FirstOrDefault());

            //TRADUCO GLI STATI
            //foreach (var stato in command.ModificaPartenza.SequenzaStati.OrderBy(c => c.DataOraAggiornamento))
            //{
            //    AggiornaStato(new AggiornaStatoMezzoCommand()
            //    {
            //        //Richiesta = 
            //    });
            //}
        }

        private void AnnullaPartenza(AnnullaPartenzaCommand command, DateTime data)
        {
            //GESTISCO RICHIESTA
            var PartenzaToDelete = Richiesta.Partenze.FirstOrDefault(x => x.Partenza.Mezzo.Codice.Equals(command.TargaMezzo));

            new RevocaPerAltraMotivazione(Richiesta, command.TargaMezzo, data, command.IdOperatore, command.TestoMotivazione);

            Richiesta.Partenze.FirstOrDefault(c => c.Partenza.Mezzo.Codice == command.TargaMezzo).PartenzaAnnullata = true;

            //_upDateRichiestaAssistenza.UpDate(Richiesta);

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

        private void NuovaPartenza(ConfermaPartenzeCommand command, DateTime data)
        {
            //foreach (var partenza in command.ConfermaPartenze.Partenze)
            //{
            //    var listaMezzi = _getStatoMezzi.Get(command.ConfermaPartenze.CodiceSede, partenza.Mezzo.Codice);
            //    if (listaMezzi.Count > 0)
            //    {
            //        if (listaMezzi[0].IdOpPrenotazione != null && !listaMezzi[0].IdOpPrenotazione.Equals(command.ConfermaPartenze.IdOperatore))
            //            throw new Exception(Costanti.MezzoErroreGiaOccupato);
            //    }
            //}

            //bool PartenzaEsistente = false;
            //foreach (var partenza in command.ConfermaPartenze.Partenze)
            //{
            //    PartenzaEsistente = Richiesta.Partenze
            //        .Select(x => x.Partenza.Mezzo.Codice.Equals(partenza.Mezzo.Codice) && !x.Partenza.Terminata && !x.Partenza.PartenzaAnnullata && !x.Partenza.Sganciata)
            //        .FirstOrDefault();

            //    if (PartenzaEsistente)
            //        throw new Exception(Costanti.PartenzaGiaPresente);
            //}

            if (Richiesta.Eventi.Where(x => x is InizioPresaInCarico).ToList().Count == 0)
                new InizioPresaInCarico(Richiesta, DateTime.UtcNow, command.ConfermaPartenze.IdOperatore);

            //foreach (var partenza in command.ConfermaPartenze.Partenze)
            //{
            //    partenza.Sganciata = false;
            //    new ComposizionePartenze(Richiesta, DateTime.UtcNow, Utente.Id, false)
            //    {
            //        Partenza = partenza
            //    };
            //}

            Richiesta.SincronizzaStatoRichiesta(Costanti.RichiestaAssegnata, Richiesta.StatoRichiesta, Utente.Id, "", data);

            command.ConfermaPartenze.richiesta = Richiesta;

            if (Richiesta.CodRichiesta == null)
                Richiesta.CodRichiesta = _generaCodiceRichiesta.Genera(Richiesta.CodSOCompetente, DateTime.UtcNow.Year);

            //foreach (var partenza in command.ConfermaPartenze.Partenze)
            //{
            //    partenza.Mezzo.IdRichiesta = Richiesta.CodRichiesta;
            //}

            var nominativo = Utente.Nome + "." + Utente.Cognome;
            if (Richiesta.UtPresaInCarico != null)
            {
                Richiesta.UtPresaInCarico.Add(nominativo);
            }
            else
            {
                Richiesta.UtPresaInCarico = new List<String>
                {
                    nominativo
                };
            }

            //foreach (var partenze in command.ConfermaPartenze.Partenze)
            //{
                foreach (var squadra in Partenza.Squadre)
                {
                    squadra.Stato = MappaStatoSquadraDaStatoMezzo.MappaStato(Partenza.Mezzo.Stato);
                }
            //}

            _updateConfermaPartenze.Update(command);
        }

        private void AggiornaStato(AggiornaStatoMezzoCommand command)
        {
            if (command.DataOraAggiornamento == null || command.DataOraAggiornamento == DateTime.MinValue)
                command.DataOraAggiornamento = DateTime.UtcNow;

            if (command.StatoMezzo == Costanti.MezzoInViaggio)
            {
                new UscitaPartenza(Richiesta, command.IdMezzo, command.DataOraAggiornamento, Richiesta.CodOperatore);

                Richiesta.SincronizzaStatoRichiesta(Costanti.RichiestaAssegnata, Richiesta.StatoRichiesta,
                    Richiesta.CodOperatore, "", command.DataOraAggiornamento);

                foreach (var composizione in Richiesta.Partenze)
                {
                    if (composizione.Partenza.Mezzo.Codice == command.IdMezzo)
                    {
                        composizione.Partenza.Mezzo.Stato = Costanti.MezzoInViaggio;
                        composizione.Partenza.Mezzo.IdRichiesta = Richiesta.CodRichiesta;
                    }
                }
            }
            else if (command.StatoMezzo == Costanti.MezzoSulPosto)
            {
                new ArrivoSulPosto(Richiesta, command.IdMezzo, command.DataOraAggiornamento, Richiesta.CodOperatore);

                Richiesta.SincronizzaStatoRichiesta(Costanti.RichiestaPresidiata, Richiesta.StatoRichiesta,
                    Richiesta.CodOperatore, "", command.DataOraAggiornamento);

                foreach (var composizione in Richiesta.Partenze)
                {
                    if (composizione.Partenza.Mezzo.Codice == command.IdMezzo)
                    {
                        composizione.Partenza.Mezzo.Stato = Costanti.MezzoSulPosto;
                        composizione.Partenza.Mezzo.IdRichiesta = Richiesta.CodRichiesta;
                    }
                }
            }
            else if (command.StatoMezzo == Costanti.MezzoInRientro)
            {
                foreach (var composizione in Richiesta.Partenze)
                {
                    if (composizione.Partenza.Mezzo.Codice == command.IdMezzo)
                    {
                        composizione.Partenza.Mezzo.Stato = Costanti.MezzoInRientro;
                        composizione.Partenza.Mezzo.IdRichiesta = null;
                        composizione.Partenza.Terminata = true;
                    }
                }

                new PartenzaInRientro(Richiesta, command.IdMezzo, command.DataOraAggiornamento, Richiesta.CodOperatore); //TODO GESTIRE IL CODICE OPERATORE
            }
            else if (command.StatoMezzo == Costanti.MezzoRientrato)
            {
                foreach (var composizione in Richiesta.Partenze)
                {
                    if (composizione.Partenza.Mezzo.Codice == command.IdMezzo && !composizione.Partenza.Terminata)
                    {
                        composizione.Partenza.Mezzo.Stato = Costanti.MezzoInSede;
                        composizione.Partenza.Mezzo.IdRichiesta = null;
                        composizione.Partenza.Terminata = true;
                    }
                }

                foreach (var composizione in Richiesta.Partenze)
                {
                    if (!composizione.Partenza.Terminata && !composizione.Partenza.Sganciata)
                    {
                        if (composizione.Partenza.Mezzo.Stato != Costanti.MezzoInSede && composizione.Partenza.Mezzo.Stato != Costanti.MezzoInUscita
                            && composizione.Partenza.Mezzo.Stato != Costanti.MezzoRientrato)
                        {
                            _mezziTuttiInSede = false;
                        }
                    }
                }

                if (_mezziTuttiInSede)
                {
                    new PartenzaRientrata(Richiesta, command.IdMezzo, command.DataOraAggiornamento, Richiesta.CodOperatore);
                }
            }
            else if (command.StatoMezzo == Costanti.MezzoInViaggio)
            {
                foreach (var composizione in Richiesta.Partenze)
                {
                    if (composizione.Partenza.Mezzo.Codice == command.IdMezzo)
                    {
                        composizione.Partenza.Mezzo.Stato = Costanti.MezzoInViaggio;
                        composizione.Partenza.Mezzo.IdRichiesta = Richiesta.CodRichiesta;
                    }
                }
            }

            if (_mezziTuttiInSede)
            {
                if (Richiesta.StatoRichiesta is Sospesa)
                {
                    new ChiusuraRichiesta("", Richiesta, command.DataOraAggiornamento, Richiesta.CodOperatore);
                }
            }

            foreach (var composizione in Richiesta.Partenze)
            {
                if (composizione.Partenza.Mezzo.Codice == command.IdMezzo)
                {
                    foreach (var squadra in composizione.Partenza.Squadre)
                    {
                        {
                            squadra.Stato = MappaStatoSquadraDaStatoMezzo.MappaStato(command.StatoMezzo);
                        }
                    }
                }

                command.Richiesta = Richiesta;

                _updateStatoPartenze.Update(command);
            }
        }
    }
}
