using CQRS.Commands;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Soccorso.Eventi;
using SO115App.API.Models.Classi.Soccorso.Eventi.Partenze;
using SO115App.API.Models.Classi.Soccorso.StatiRichiesta;
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
        public ModificaPartenzaCommandHandler(IUpdateStatoPartenze updateStatoPartenze) => _updateStatoPartenze = updateStatoPartenze;

        public void Handle(ModificaPartenzaCommand command)
        {
            var Richiesta = command.Richiesta;

            if (command.ModificaPartenza.Annullamento)
            {
                //ANNULLAMENTO ---
                var partenzaDaAnnullare = command.Richiesta.Partenze.FirstOrDefault(p => p.Partenza.Mezzo.Codice.Equals(command.ModificaPartenza.CodMezzoDaAnnullare));

                new RevocaPerSostituzioneMezzo(Richiesta, command.ModificaPartenza.CodMezzoDaAnnullare, command.ModificaPartenza.DataAnnullamento.Value, command.IdOperatore, command.ModificaPartenza.MotivazioneAnnullamento);

                partenzaDaAnnullare.PartenzaAnnullata = true;
                partenzaDaAnnullare.Partenza.PartenzaAnnullata = true;
                partenzaDaAnnullare.Partenza.Mezzo.Stato = Costanti.MezzoInSede;

                foreach (var squadra in partenzaDaAnnullare.Partenza.Squadre)
                    squadra.Stato = MappaStatoSquadraDaStatoMezzo.MappaStato(partenzaDaAnnullare.Partenza.Mezzo.Stato);


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
                foreach (var squadra in nuovaPartenza.Partenza.Squadre)
                    squadra.Stato = MappaStatoSquadraDaStatoMezzo.MappaStato(nuovaPartenza.Partenza.Mezzo.Stato);

                Richiesta.Partenze.Add(nuovaPartenza);

                _updateStatoPartenze.Update(new AggiornaStatoMezzoCommand()
                {
                    CodiceSede = command.CodSede,
                    CodRichiesta = Richiesta.CodRichiesta,
                    Richiesta = Richiesta,
                    IdUtente = command.IdOperatore,
                    IdMezzo = partenzaDaAnnullare.Partenza.Mezzo.Codice,
                    DataOraAggiornamento = command.ModificaPartenza.DataAnnullamento.Value,
                    StatoMezzo = Costanti.MezzoInSede
                });
            }


            //AGGIORNAMENTO STATO
            if (command.ModificaPartenza.SequenzaStati != null && command.ModificaPartenza.SequenzaStati.Count > 0)
            {
                var partenzaDaLavorare = Richiesta.Partenze
                    .OrderByDescending(p => p.Istante)
                    .FirstOrDefault(p => p.Partenza.Mezzo.Codice.Equals(command.ModificaPartenza.SequenzaStati.Select(s => s.CodMezzo).FirstOrDefault()));
                
                foreach (var stato in command.ModificaPartenza.SequenzaStati.OrderBy(c => c.DataOraAggiornamento))
                {
                    bool _mezziTuttiInSede = true;

                    #region Switch StatoMezzo

                    if (stato.Stato == Costanti.MezzoInViaggio)
                    {
                        new UscitaPartenza(Richiesta, partenzaDaLavorare.Partenza.Mezzo.Codice, stato.DataOraAggiornamento, Richiesta.CodOperatore);

                        Richiesta.SincronizzaStatoRichiesta(Costanti.RichiestaAssegnata, Richiesta.StatoRichiesta,
                            Richiesta.CodOperatore, "", stato.DataOraAggiornamento);

                        partenzaDaLavorare.Partenza.Mezzo.Stato = Costanti.MezzoInViaggio;
                        partenzaDaLavorare.Partenza.Mezzo.IdRichiesta = Richiesta.Id;
                    }
                    else if (stato.Stato == Costanti.MezzoSulPosto)
                    {
                        new ArrivoSulPosto(Richiesta, partenzaDaLavorare.Partenza.Mezzo.Codice, stato.DataOraAggiornamento, Richiesta.CodOperatore);

                        Richiesta.SincronizzaStatoRichiesta(Costanti.RichiestaPresidiata, Richiesta.StatoRichiesta,
                            Richiesta.CodOperatore, "", stato.DataOraAggiornamento);

                        partenzaDaLavorare.Partenza.Mezzo.Stato = Costanti.MezzoSulPosto;
                        partenzaDaLavorare.Partenza.Mezzo.IdRichiesta = Richiesta.Id;
                    }
                    else if (stato.Stato == Costanti.MezzoInRientro)
                    {
                        partenzaDaLavorare.Partenza.Mezzo.Stato = Costanti.MezzoInRientro;

                        new PartenzaInRientro(Richiesta, partenzaDaLavorare.Partenza.Mezzo.Codice, stato.DataOraAggiornamento, Richiesta.CodOperatore);
                    }
                    else if (stato.Stato == Costanti.MezzoRientrato)
                    {
                        if (!partenzaDaLavorare.Partenza.Terminata)
                        {
                            partenzaDaLavorare.Partenza.Mezzo.Stato = Costanti.MezzoInSede;
                            partenzaDaLavorare.Partenza.Mezzo.IdRichiesta = null;
                            partenzaDaLavorare.Partenza.Terminata = true;
                        }

                        if (partenzaDaLavorare.Partenza.Mezzo.Stato != Costanti.MezzoInSede
                            && partenzaDaLavorare.Partenza.Mezzo.Stato != Costanti.MezzoInUscita
                            && partenzaDaLavorare.Partenza.Mezzo.Stato != Costanti.MezzoRientrato)
                        {
                            _mezziTuttiInSede = false;
                        }

                        if (_mezziTuttiInSede)
                        {
                            new PartenzaRientrata(Richiesta, partenzaDaLavorare.Partenza.Mezzo.Codice, stato.DataOraAggiornamento, Richiesta.CodOperatore);
                        }
                    }
                    else if (stato.Stato == Costanti.MezzoInViaggio)
                    {
                        partenzaDaLavorare.Partenza.Mezzo.Stato = Costanti.MezzoInViaggio;
                        partenzaDaLavorare.Partenza.Mezzo.IdRichiesta = Richiesta.Id;
                    }

                    #endregion Switch StatoMezzo

                    if (_mezziTuttiInSede && Richiesta.StatoRichiesta is Sospesa)
                    {
                        new ChiusuraRichiesta("", Richiesta, stato.DataOraAggiornamento, Richiesta.CodOperatore);
                    }

                    foreach (var squadra in partenzaDaLavorare.Partenza.Squadre)
                    {
                        squadra.Stato = MappaStatoSquadraDaStatoMezzo.MappaStato(stato.Stato);
                    }

                    _updateStatoPartenze.Update(new AggiornaStatoMezzoCommand()
                    {
                        CodiceSede = command.CodSede,
                        CodRichiesta = Richiesta.Codice,
                        Richiesta = Richiesta,
                        IdUtente = command.IdOperatore,
                        DataOraAggiornamento = stato.DataOraAggiornamento,
                        StatoMezzo = stato.Stato,
                        IdMezzo = stato.CodMezzo
                    });
                }
            }
        }
    }
}
