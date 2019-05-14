//-----------------------------------------------------------------------
// <copyright file="InserisciTelefonataCommandHandler.cs" company="CNVVF">
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
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Classi.Soccorso.Eventi;
using SO115App.API.Models.Classi.Soccorso.Eventi.Segnalazioni;
using SO115App.API.Models.Servizi.CQRS.Commands.GestioneSoccorso.InserisciTelefonata.CommandDTO;
using SO115App.API.Models.Servizi.Infrastruttura.Anagrafiche;
using SO115App.API.Models.Servizi.Infrastruttura.Autenticazione;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using System;
using System.Collections.Generic;

namespace SO115App.API.Models.Servizi.CQRS.Commands.GestioneSoccorso.InserisciTelefonata
{
    /// <summary>
    ///   Command che inserisce una nuova telefonata, creando la relativa richiesta
    /// </summary>
    public class InserisciTelefonataCommandHandler : ICommandHandler<InserisciTelefonataCommand>
    {
        /// <summary>
        ///   Istanza del servizio
        /// </summary>
        private readonly IGetOperatoreAutenticato getOperatoreAutenticato;

        /// <summary>
        ///   Istanza del servizio
        /// </summary>
        private readonly IGetTipoInterventoByCodice getTipoInterventoByCodice;

        /// <summary>
        ///   Istanza del servizio
        /// </summary>
        private readonly ISaveRichiestaAssistenza saveRichiestaAssistenza;

        /// <summary>
        ///   Il costruttore
        /// </summary>
        /// <param name="getTipoInterventoByCodice">
        ///   Istanza del servizio di risoluzione del tipo intervento dal codice
        /// </param>
        /// <param name="getOperatoreAutenticato">
        ///   Istanza del servizio che restituisce l'operatore autenticato
        /// </param>
        /// <param name="saveRichiestaAssistenza">
        ///   Istanza del servizio che salva una richiesta di assistenza
        /// </param>
        public InserisciTelefonataCommandHandler(
            IGetTipoInterventoByCodice getTipoInterventoByCodice,
            IGetOperatoreAutenticato getOperatoreAutenticato,
            ISaveRichiestaAssistenza saveRichiestaAssistenza)
        {
            this.getTipoInterventoByCodice = getTipoInterventoByCodice;
            this.getOperatoreAutenticato = getOperatoreAutenticato;
            this.saveRichiestaAssistenza = saveRichiestaAssistenza;
        }

        /// <summary>
        ///   Metodo di esecuzione del command
        /// </summary>
        /// <param name="command">Il DTO</param>
        public void Handle(InserisciTelefonataCommand command)
        {
            var fonte = string.Format("op: {0}", this.getOperatoreAutenticato.Get());

            List<Tipologia> ListaTipologie = new List<Tipologia>();
            foreach (string codice in command.idTipiIntervento)
            {
                Tipologia tipologiaRichiesta = new Tipologia(getTipoInterventoByCodice.Get(codice).Codice, getTipoInterventoByCodice.Get(codice).Descrizione, "");
                ListaTipologie.Add(tipologiaRichiesta);
            }

            var richiesta = new RichiestaAssistenza()
            {
                //Geolocalizzazione = command.Geolocalizzazione,
                Tipologie = ListaTipologie,
                Indirizzo = command.Indirizzo,
                ZoneEmergenza = command.ZoneEmergenza,
            };

            foreach (var t in command.Tags)
            {
                richiesta.Tags.Add(t);
            }

            new Telefonata(richiesta, command.NumeroChiamata, command.IstanteChiamata, fonte)
            {
                CognomeChiamante = command.Cognome,
                NomeChiamante = command.Nome,
                RagioneSociale = command.RagioneSociale,
                //Geolocalizzazione = command.Geolocalizzazione,
                Motivazione = command.Motivazione,
                NotePrivate = command.NotePrivate,
                NotePubbliche = command.NotePubbliche,
                NumeroTelefono = command.Telefono,
                //Esito = command.Azione.ToString(),
            };

            this.saveRichiestaAssistenza.Save(richiesta);
        }
    }
}