//-----------------------------------------------------------------------
// <copyright file="MezzoPrenotatoQueryHandler.cs" company="CNVVF">
// Copyright (C) 2017 - CNVVF
//
// This file is part of SOVVF.
// SOVVF is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// SOVVF is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see http://www.gnu.org/licenses/.
// </copyright>
//-----------------------------------------------------------------------
using CQRS.Commands;
using DomainModel.CQRS.Commands.ConfermaPartenze;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Classi.Soccorso.Eventi.Partenze;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Classi.Soccorso.Eventi.Partenze;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using SO115App.Models.Servizi.Infrastruttura.GeoFleet;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.GenerazioneCodiciRichiesta;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Statri;
using SO115App.Models.Servizi.Infrastruttura.Turni;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.ConfermaPartenze
{
    public class ConfermaPartenzeCommandHandler : ICommandHandler<ConfermaPartenzeCommand>
    {
        private readonly IUpdateConfermaPartenze _updateConfermaPartenze;
        private readonly IUpDateRichiestaAssistenza _updateRichiestaAssistenza;
        private readonly IGetRichiesta _getRichiestaById;
        private readonly IGeneraCodiceRichiesta _generaCodiceRichiesta;
        private readonly IGetStatoMezzi _getStatoMezzi;
        private readonly IGetMaxCodicePartenza _getMaxCodicePartenza;
        private readonly IGetTurno _getTurno;

        private readonly ISetUscitaMezzo _setUscitaMezzo;

        private readonly ISendSTATRIItem _sendNewItemSTATRI;
        private readonly ICheckCongruitaPartenze _checkCongruita;

        public ConfermaPartenzeCommandHandler(IUpdateConfermaPartenze updateConfermaPartenze, IGetRichiesta getRichiestaById,
            IGeneraCodiceRichiesta generaCodiceRichiesta, IUpDateRichiestaAssistenza updateRichiestaAssistenza,
            IGetStatoMezzi getStatoMezzi, IGetMaxCodicePartenza getMaxCodicePartenza,
            ISendSTATRIItem sendNewItemSTATRI, ICheckCongruitaPartenze checkCongruita, IGetTurno getTurno,
            ISetUscitaMezzo setUscitaMezzo)
        {
            _updateConfermaPartenze = updateConfermaPartenze;
            _getRichiestaById = getRichiestaById;
            _generaCodiceRichiesta = generaCodiceRichiesta;
            _updateRichiestaAssistenza = updateRichiestaAssistenza;
            _getStatoMezzi = getStatoMezzi;
            _getMaxCodicePartenza = getMaxCodicePartenza;
            _sendNewItemSTATRI = sendNewItemSTATRI;
            _checkCongruita = checkCongruita;
            _getTurno = getTurno;
            _setUscitaMezzo = setUscitaMezzo;
        }

        public void Handle(ConfermaPartenzeCommand command)
        {
            var dataAdesso = DateTime.UtcNow;

            //GENERAZIONE CODICE INTERVENTO
            var sedeRichiesta = command.Richiesta.CodSOCompetente;

            if (command.Richiesta.CodRichiesta == null)
                command.Richiesta.CodRichiesta = _generaCodiceRichiesta.GeneraCodiceIntervento(sedeRichiesta, dataAdesso.Year);

            bool riassegnazioni = command.ConfermaPartenze.Partenze.Any(p => p.Squadre.All(s => s.Stato.Equals(MappaStatoSquadraDaStatoMezzo.MappaStato(Costanti.MezzoInRientro))));
            bool sganciamento = command.ConfermaPartenze.IdRichiestaDaSganciare != null;

            #region SGANCIAMENTO

            if (sganciamento && !riassegnazioni)
            {
                var idComposizioneDaSganciare = 0;
                var StatoInViaggio = 0;
                var StatoSulPosto = 0;

                command.RichiestaDaSganciare = _getRichiestaById.GetByCodice(command.ConfermaPartenze.IdRichiestaDaSganciare);

                Parallel.ForEach(command.RichiestaDaSganciare.Eventi.OfType<ComposizionePartenze>().Select(p => p.Partenza), composizione =>
                {
                    if (!composizione.PartenzaAnnullata && !composizione.Terminata
                        && !composizione.Sganciata && !composizione.Mezzo.Stato.Equals(Costanti.MezzoInRientro))
                    {
                        if (composizione.Mezzo.Codice.Equals(command.ConfermaPartenze.IdMezzoDaSganciare))
                            composizione.Sganciata = true;

                        if (composizione.Mezzo.Stato == Costanti.MezzoInViaggio && !composizione.Mezzo.Codice.Equals(command.ConfermaPartenze.IdMezzoDaSganciare))
                            StatoInViaggio++;

                        if (composizione.Mezzo.Stato == Costanti.MezzoSulPosto && !composizione.Mezzo.Codice.Equals(command.ConfermaPartenze.IdMezzoDaSganciare))
                            StatoSulPosto++;

                        idComposizioneDaSganciare++;
                    }
                });

                Parallel.ForEach(command.RichiestaDaSganciare.Partenze, composizione =>
                {
                    if (composizione.Partenza.Mezzo.Codice.Equals(command.ConfermaPartenze.IdMezzoDaSganciare))
                        composizione.Partenza.Sganciata = true;
                });

                if (idComposizioneDaSganciare == 1)
                    command.RichiestaDaSganciare.SincronizzaStatoRichiesta(Costanti.RichiestaSospesa, command.RichiestaDaSganciare.StatoRichiesta, command.RichiestaDaSganciare.CodOperatore, "", dataAdesso, null);
                else
                {
                    if (StatoSulPosto > 0)
                        command.RichiestaDaSganciare.SincronizzaStatoRichiesta(Costanti.RichiestaPresidiata, command.RichiestaDaSganciare.StatoRichiesta, command.RichiestaDaSganciare.CodOperatore, "", dataAdesso, null);
                    else if (StatoInViaggio > 0)
                        command.RichiestaDaSganciare.SincronizzaStatoRichiesta(Costanti.RichiestaAssegnata, command.RichiestaDaSganciare.StatoRichiesta, command.RichiestaDaSganciare.CodOperatore, "", dataAdesso, null);
                }

                new RevocaPerRiassegnazione(command.RichiestaDaSganciare, command.Richiesta, command.ConfermaPartenze.IdMezzoDaSganciare, dataAdesso, command.Utente.Id,
                    command.ConfermaPartenze.Partenze.FirstOrDefault(p => p.Mezzo.Codice == command.ConfermaPartenze.IdMezzoDaSganciare).Codice);

                //SOSPENDO LA RICHIESTA SE LA PARTENZA DA SGANCIARE E' L'ULTIMA IN CORSO SU TALE RICHIESTA
                //if (command.Richiesta.lstPartenze.Where(p => !p.Terminata && !p.PartenzaAnnullata && !p.Sganciata && p.Mezzo.Codice != command.ConfermaPartenze.IdMezzoDaSganciare).Count() == 0)
                //    new RichiestaSospesa($"Scangio dell'ultima partenza {command.ConfermaPartenze.Partenze.First().Codice} sulla richiesta {command.Richiesta.Codice}", command.Richiesta, dataAdesso, command.Utente.Id);

                //_set

                _updateRichiestaAssistenza.UpDate(command.RichiestaDaSganciare);
            }

            #endregion SGANCIAMENTO


            var PartenzaEsistente = false;

            //PARALLEL
            foreach (var partenza in command.ConfermaPartenze.Partenze)
            {
                //CHECK MEZZO OCCUPATO E PARTENZE ESISTENTI
                var listaMezzi = _getStatoMezzi.Get(new string[] { command.ConfermaPartenze.CodiceSede }, partenza.Mezzo.Codice);
                if (listaMezzi.Count > 0)
                {
                    if (listaMezzi[0].IdOpPrenotazione != null && !listaMezzi[0].IdOpPrenotazione.Equals(command.ConfermaPartenze.IdOperatore))
                        throw new Exception(Costanti.MezzoErroreGiaOccupato);
                }

                PartenzaEsistente = command.Richiesta.Partenze.Select(x => x.Partenza.Mezzo.Codice.Equals(partenza.Mezzo.Codice) && !x.Partenza.Terminata && !x.Partenza.PartenzaAnnullata && !x.Partenza.Sganciata).FirstOrDefault();

                if (PartenzaEsistente)
                    throw new Exception(Costanti.PartenzaGiaPresente);

                //GESTISCO STATI, EVENTI E PARTENZE
                if (partenza.Mezzo.IdRichiesta != null && partenza.Mezzo.IdRichiesta != command.Richiesta.Codice)
                {
                    //SE IL MEZZO E' IN RIENTRO SU UN'ALTRA RICHIESTA, FACCIO RIENTRARE LE PARTENZE E GESTISCO LA RICHIESTA
                    command.RichiestaDaSganciare = _getRichiestaById.GetByCodice(partenza.Mezzo.IdRichiesta);

                    var partenzaDaRientrare = command.RichiestaDaSganciare.Partenze.First(p => p.Partenza.Mezzo.Codice == partenza.Mezzo.Codice).Partenza;

                    //GESTOIONE MEZZO IN RIENTRO
                    if (partenzaDaRientrare.Mezzo.Stato == Costanti.MezzoInRientro)
                    {
                        if (!riassegnazioni)
                        {
                            command.RichiestaDaSganciare.CambiaStatoPartenza(partenzaDaRientrare, new CambioStatoMezzo()
                            {
                                CodMezzo = partenzaDaRientrare.Mezzo.Codice,
                                Istante = dataAdesso,
                                Stato = Costanti.MezzoRientrato
                            }, _sendNewItemSTATRI, _checkCongruita, command.Utente.Id);

                            _updateRichiestaAssistenza.UpDate(command.RichiestaDaSganciare);
                        }

                        partenza.Mezzo.Stato = Costanti.MezzoInViaggio;

                        //LINQ
                        foreach (var squadra in partenza.Squadre)
                        {
                            squadra.Stato = Classi.Condivise.Squadra.StatoSquadra.InViaggio;
                        }
                    }
                }

                command.Richiesta.CambiaStatoPartenza(partenza, new CambioStatoMezzo()
                {
                    CodMezzo = partenza.Mezzo.Codice,
                    Istante = dataAdesso,
                    Stato = Costanti.MezzoInUscita
                }, _sendNewItemSTATRI, _checkCongruita, command.Utente.Id);

                command.Richiesta.CambiaStatoPartenza(partenza, new CambioStatoMezzo()
                {
                    CodMezzo = partenza.Mezzo.Codice,
                    Istante = dataAdesso,
                    Stato = Costanti.MezzoInViaggio
                }, _sendNewItemSTATRI, _checkCongruita, command.Utente.Id, partenza.Mezzo.CoordinateStrg);

                dataAdesso = dataAdesso.AddSeconds(1);
            }

            //GESTIONE UTENTE PRESA IN CARICO
            var nominativo = command.Utente.Nome + "." + command.Utente.Cognome;

            if (command.Richiesta.UtPresaInCarico != null)
                command.Richiesta.UtPresaInCarico.Add(nominativo);
            else
                command.Richiesta.UtPresaInCarico = new List<string> { nominativo };

            //GESTIONE CODICE PARTENZA
            int codpart = _getMaxCodicePartenza.GetMax();
            foreach (var partenza in command.ConfermaPartenze.Partenze.Where(p => p.Codice == "0" || p.Codice == null))
            {
                codpart++;

                if (partenza.Mezzo.Distaccamento.Codice != null)
                    partenza.Codice = partenza.Mezzo.Distaccamento.Codice.Substring(0, 2) + codpart;
                else if (partenza.Mezzo.Appartenenza != null)
                    partenza.Codice = partenza.Mezzo.Appartenenza.Substring(0, 2) + codpart;

                partenza.Turno = _getTurno.Get().Codice;

                command.Richiesta.ListaEventi.OfType<ComposizionePartenze>().Last(e => e.CodiceMezzo.Equals(partenza.Mezzo.Codice)).CodicePartenza = partenza.Codice;
                command.Richiesta.ListaEventi.OfType<UscitaPartenza>().Last(e => e.CodiceMezzo.Equals(partenza.Mezzo.Codice)).CodicePartenza = partenza.Codice;
            }

            #region RIASSEGNAZIONE

            var richiesteDaTerminare = new List<RichiestaAssistenza>();

            if (riassegnazioni && !sganciamento)
            {
                var mezziInRientro = _getStatoMezzi.Get(command.ConfermaPartenze.CodiceSede).Where(m => m.StatoOperativo.Equals(Costanti.MezzoInRientro)).ToList();

                foreach (var partenza in command.ConfermaPartenze.Partenze)
                {
                    var statoOperativoMezzo = mezziInRientro.Find(s => s.CodiceMezzo == partenza.Mezzo.Codice);
                    var richiestaDaTerminare = richiesteDaTerminare.Select(r => r.CodRichiesta).Contains(statoOperativoMezzo.CodiceRichiesta) 
                        ? richiesteDaTerminare.Find(r => r.CodRichiesta.Equals(statoOperativoMezzo.CodiceRichiesta))
                        : _getRichiestaById.GetByCodice(statoOperativoMezzo.CodiceRichiesta);
                    var partenzaDaTerminare = richiestaDaTerminare.lstPartenze.Find(p => p.Mezzo.Codice == partenza.Mezzo.Codice);

                    string note = $"La partenza {partenzaDaTerminare.Codice} con mezzo {partenza.Mezzo.Codice.Split('.').Last()} è stata riassegnata alla richiesta {command.Richiesta.Codice} con codice {partenza.Codice}";

                    new MezzoRiassegnato(richiestaDaTerminare, partenza.Mezzo.Codice.Split('.').Last(), dataAdesso, command.Utente.Id, "MezzoRiassegnato", partenza.Codice, note);

                    partenzaDaTerminare.Terminata = true;

                    if (!richiesteDaTerminare.Select(r => r.Codice).Contains(richiestaDaTerminare.Codice))
                        richiesteDaTerminare.Add(richiestaDaTerminare);

                    _updateRichiestaAssistenza.UpDate(richiestaDaTerminare);

                    //_setUscitaMezzo.Set(new SO115App.Models.Classi.ServiziEsterni.Gac.UscitaGAC
                    //{
                    //    ///
                    //});
                }
            }

            #endregion

            //SALVO SUL DB

            //if(richiesteDaTerminare != null && richiesteDaTerminare.Count > 0) foreach (var richiesta in richiesteDaTerminare.Where(r => !r.CodRichiesta.Equals(command.Richiesta.CodRichiesta)))
            //{
            //}

            _updateConfermaPartenze.Update(command);
        }
    }
}
