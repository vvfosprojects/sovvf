using CQRS.Commands;
using DomainModel.CQRS.Commands.ConfermaPartenze;
using SO115App.API.Models.Classi.Autenticazione;
using SO115App.API.Models.Classi.Composizione;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Classi.Soccorso.Eventi;
using SO115App.API.Models.Classi.Soccorso.Eventi.Partenze;
using SO115App.API.Models.Classi.Soccorso.StatiRichiesta;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.Mezzi;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.AggiornaStatoMezzo;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.AnnullaPartenza;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.GenerazioneCodiciRichiesta;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Squadre;
using System;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.ModificaPartenza
{
    public class ModificaPartenzaCommandHandler : ICommandHandler<ModificaPartenzaCommand>
    {
        private readonly IGetRichiestaById _getRichiestaById;
        private readonly IUpdateStatoPartenze _updateStatoPartenze;
        private readonly IGeneraCodiceRichiesta _generaCodiceRichiesta;
        private readonly IGetUtenteById _getUtenteById;
        private readonly IUpdateConfermaPartenze _updateConfermaPartenze;
        private readonly IGetListaMezzi _getListaMezzi;
        private readonly IGetListaSquadre _getListaSquadre;

        private RichiestaAssistenza Richiesta;
        private Partenza Partenza;
        private Utente Utente;

        private bool _mezziTuttiInSede = true;

        public ModificaPartenzaCommandHandler(
            IGetRichiestaById getRichiestaById,
            IUpdateStatoPartenze updateStatoPartenze,
            IGeneraCodiceRichiesta generaCodiceRichiesta,
            IGetUtenteById getUtenteById,
            IUpdateConfermaPartenze updateConfermaPartenze,
            IGetListaMezzi getListaMezzi,
            IGetListaSquadre getListaSquadre
        )
        {
            _getRichiestaById = getRichiestaById;
            _updateStatoPartenze = updateStatoPartenze;
            _generaCodiceRichiesta = generaCodiceRichiesta;
            _getUtenteById = getUtenteById;
            _updateConfermaPartenze = updateConfermaPartenze;
            _getListaMezzi = getListaMezzi;
            _getListaSquadre = getListaSquadre;
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
                .FirstOrDefault(),
                command.ModificaPartenza.CodMezzo, command.ModificaPartenza.CodSquadre);

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

        private void NuovaPartenza(ConfermaPartenzeCommand command, DateTime data, string CodMezzo, string[] CodSquadre)
        {
            var lstPersonale = _getListaSquadre.Get(new List<string>() { command.ConfermaPartenze.CodiceSede }).Result;
            var lstMezzi = _getListaMezzi.Get(new string[] { command.ConfermaPartenze.CodiceSede });

            new ComposizionePartenze(Richiesta, data, Utente.Id, false)
            {
                Partenza = new Partenza()
                {
                    Mezzo = lstMezzi.Select(c => c.Mezzo.Mezzo).FirstOrDefault(c => c.Codice == CodMezzo),
                    Squadre = lstPersonale.Where(c => CodSquadre.Contains(c.Codice)).ToList(),
                    Sganciata = false
                }
            };

            Richiesta.SincronizzaStatoRichiesta(Costanti.RichiestaAssegnata, Richiesta.StatoRichiesta, Utente.Id, "", data);

            if (Richiesta.CodRichiesta == null)
                Richiesta.CodRichiesta = _generaCodiceRichiesta.Genera(Richiesta.CodSOCompetente, DateTime.UtcNow.Year);

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

            foreach (var squadra in Partenza.Squadre)
            {
                squadra.Stato = MappaStatoSquadraDaStatoMezzo.MappaStato(Partenza.Mezzo.Stato);
            }

            command.ConfermaPartenze.richiesta = Richiesta;

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
