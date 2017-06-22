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
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Modello.Classi.Soccorso;
using Modello.Classi.Soccorso.Eventi;
using Modello.Classi.Soccorso.Eventi.Segnalazioni;
using Modello.Servizi.CQRS.Commands.GestioneSoccorso.InserisciTelefonata.CommandDTO;
using Modello.Servizi.Infrastruttura.Anagrafiche;
using Modello.Servizi.Infrastruttura.Autenticazione;
using Modello.Servizi.Infrastruttura.GestioneSoccorso;

namespace Modello.Servizi.CQRS.Commands.GestioneSoccorso.InserisciTelefonata
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
        private readonly IInserisciNuovaRichiesta inserisciNuovaRichiesta;

        /// <summary>
        ///   Il costruttore
        /// </summary>
        /// <param name="getTipoInterventoByCodice">
        ///   Istanza del servizio di risoluzione del tipo intervento dal codice
        /// </param>
        /// <param name="getOperatoreAutenticato">Istanza del servizio che da' l'operatiore autenticato</param>
        /// <param name="inserisciNuovaRichiesta">
        ///   Istanza del servizio che inserisce una nuova richiesta
        /// </param>
        public InserisciTelefonataCommandHandler(
            IGetTipoInterventoByCodice getTipoInterventoByCodice,
            IGetOperatoreAutenticato getOperatoreAutenticato,
            IInserisciNuovaRichiesta inserisciNuovaRichiesta)
        {
            this.getTipoInterventoByCodice = getTipoInterventoByCodice;
            this.getOperatoreAutenticato = getOperatoreAutenticato;
            this.inserisciNuovaRichiesta = inserisciNuovaRichiesta;
        }

        /// <summary>
        ///   Metodo di esecuzione del command
        /// </summary>
        /// <param name="command">Il DTO</param>
        public void Handle(InserisciTelefonataCommand command)
        {
            var fonte = string.Format("op: {0}", this.getOperatoreAutenticato.Get());

            var richiesta = new RichiestaAssistenza()
            {
                Geolocalizzazione = command.Geolocalizzazione,
                Tipologie = command.CodiciTipiIntervento.Select(c => this.getTipoInterventoByCodice.Get(c)).ToList(),
                Indirizzo = command.Indirizzo,
                ZonaEmergenza = command.ZonaEmergenza,
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
                Geolocalizzazione = command.Geolocalizzazione,
                Motivazione = command.Motivazione,
                NotePrivate = command.NotePrivate,
                NotePubbliche = command.NotePubbliche,
                NumeroTelefono = command.Telefono,
                Esito = command.Azione.ToString(),
            };

            if (command.Azione == Azione.FalsoAllarme || command.Azione == Azione.InterventoNonPiuNecessario)
            {
                new ChiusuraRichiesta(
                    command.Azione.ToString(),
                    richiesta,
                    DateTime.Now,
                    fonte);
            }

            this.inserisciNuovaRichiesta.Inserisci(richiesta);
        }
    }
}
