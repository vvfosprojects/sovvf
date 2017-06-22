//-----------------------------------------------------------------------
// <copyright file="InserisciTelefonataCommand.cs" company="CNVVF">
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
using Modello.Classi.Geo;

namespace Modello.Servizi.CQRS.Commands.GestioneSoccorso.InserisciTelefonata.CommandDTO
{
    /// <summary>
    ///   DTO del comando di inserimento telefonata
    /// </summary>
    public class InserisciTelefonataCommand
    {
        /// <summary>
        ///   Il numero associato alla chiamata
        /// </summary>
        public string NumeroChiamata { get; set; }

        /// <summary>
        ///   L'istante della chiamata
        /// </summary>
        public DateTime IstanteChiamata { get; set; }

        /// <summary>
        ///   Il nome dell'operatore
        /// </summary>
        public string Operatore { get; set; }

        /// <summary>
        ///   Il codice della scheda contatto
        /// </summary>
        public string CodiceSchedaContatto { get; set; }

        /// <summary>
        ///   La lista dei codici dei tipi di intervento
        /// </summary>
        public string[] CodiciTipiIntervento { get; set; }

        /// <summary>
        ///   Il cognome del chiamante
        /// </summary>
        public string Cognome { get; set; }

        /// <summary>
        ///   Il nome del chiamante
        /// </summary>
        public string Nome { get; set; }

        /// <summary>
        ///   La ragione sociale del chiamante
        /// </summary>
        public string RagioneSociale { get; set; }

        /// <summary>
        ///   Il telefono del chiamante
        /// </summary>
        public string Telefono { get; set; }

        /// <summary>
        ///   La geolocalizzazione del luogo del sinistro
        /// </summary>
        public Geolocalizzazione Geolocalizzazione { get; set; }

        /// <summary>
        ///   L'indirizzo del luogo del sinistro
        /// </summary>
        public string Indirizzo { get; set; }

        /// <summary>
        ///   Il nome della eventuale zona di emergenza (per es. sisma Emilia)
        /// </summary>
        public string ZonaEmergenza { get; set; }

        /// <summary>
        ///   Una lista di etichette relative alla chiamata, utile al fine di effettuare una
        ///   classificazione "veloce" delle chiamate.
        /// </summary>
        public string[] Tags { get; set; }

        /// <summary>
        ///   La motivazione percui è avvenuta la chiamata
        /// </summary>
        public string Motivazione { get; set; }

        /// <summary>
        ///   Delle note che descrivono meglio il uogo del sinistro (per es. vicino supermercato Spendibene)
        /// </summary>
        public string NoteIndirizzo { get; set; }

        /// <summary>
        ///   Note pubbliche sulla chiamata, visibili e divulgabili senza limitazioni (per es.
        ///   "attenzione al cane in giardino")
        /// </summary>
        public string NotePubbliche { get; set; }

        /// <summary>
        ///   Note private sulla chiamata, da tenere confinate entro il CNVVF (per es. "il chiamante
        ///   dichiara di avere lasciato il gas aperto ma non è credibile")
        /// </summary>
        public string NotePrivate { get; set; }

        /// <summary>
        ///   E' l'azione che si intende eseguire dopo l'acquisizione della chiamata
        /// </summary>
        public Azione Azione { get; set; }
    }
}
