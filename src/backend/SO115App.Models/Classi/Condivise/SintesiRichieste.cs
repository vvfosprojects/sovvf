﻿//-----------------------------------------------------------------------
// <copyright file="SintesiRichieste.cs" company="CNVVF">
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
using System.ComponentModel.DataAnnotations;
using SO115App.API.Models.Classi.Autenticazione;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Classi.Utenti;
using SO115App.Models.Classi.Condivise;

namespace SO115App.API.Models.Classi.Condivise
{
    /// <summary>
    ///   Contiene le informazioni di sintesi di una Richiesta di Assistenza, utile ad alimentare il
    ///   primo ed il secondo livello di dettaglio del componente richiesta di assistenza sul frontend.
    /// </summary>
    public class SintesiRichieste
    {
        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        public SintesiRichieste()
        {
            this.ZoneEmergenza = new string[0];
            this.Etichette = new string[0];
            this.Competenze = new List<Sede>();
        }

        /// <summary>
        ///   L'id della richiesta
        /// </summary>
        public string Id { get; set; }

        /// <summary>
        ///   Identifica il codice della Chiamata
        /// </summary>
        public string Codice { get; set; }

        /// <summary>
        ///   E' il codice della Richiesta di Assistenza
        /// </summary>
        public string CodiceRichiesta { get; set; }

        /// <summary>
        ///   Utente che ha generato la segnalazione
        /// </summary>
        [Required(ErrorMessage = "Operatore obbligatorio.")]
        public Utente Operatore { get; set; }

        /// <summary>
        ///   Ricezione della richiesta (via telefono, ecc.)
        /// </summary>
        [Required(ErrorMessage = "Istante ricezione richiesta obbligatorio.")]
        [DataType(DataType.DateTime)]
        public DateTime IstanteRicezioneRichiesta { get; set; }

        /// <summary>
        ///   Stato della richiesta
        /// </summary>
        [Required(ErrorMessage = "Stato obbligatorio.")]
        public string Stato { get; set; }

        /// <summary>
        ///   Priorita della richiesta
        /// </summary>
        public RichiestaAssistenza.Priorita PrioritaRichiesta { get; set; }

        [Required(ErrorMessage = "Tipologia obbligatoria.")]
        public List<Tipologia> Tipologie { get; set; }

        /// <summary>
        ///   Descrizione della richiesta
        /// </summary>
        [Required(ErrorMessage = "Descrizione obbligatoria.")]
        public string Descrizione { get; set; }

        /// <summary>
        ///   Descrizione del richiedente
        /// </summary>
        [Required(ErrorMessage = "Richiedtente obbligatorio.")]
        public Richiedente Richiedente { get; set; }

        /// <summary>
        ///   Localita della richiesta
        /// </summary>
        [Required(ErrorMessage = "Località obbligatoria.")]
        public Localita Localita { get; set; }

        /// <summary>
        ///   Il turno nel quale viene presa la chiamata
        /// </summary>
        public Turno TurnoInserimentoChiamata { get; set; }

        /// <summary>
        ///   Il turno nel quale viene lavorato l'intervento
        /// </summary>
        public Turno TurnoIntervento { get; set; }

        /// <summary>
        ///   Indica se il terreno è uno tra Boschi/Campi/Sterpaglie e ne indica i mq.
        /// </summary>
        public List<TipologiaTerreno> TipoTerreno { get; set; }

        /// <summary>
        ///   Lista degli enti intervenuti (Es. ACEA)
        /// </summary>
        public List<EnteIntervenuto> ListaEntiIntervenuti { get; set; }

        /// <summary>
        ///   Se l'intervento è su un obiettivo ritenuto rilevante (Es. Colosseo) si seleziona da
        ///   interfaccia e si registra il codice
        /// </summary>
        public ObiettivoSensibile ObiettivoSensibile { get; set; }

        /// <summary>
        ///   Competenze della richiesta
        /// </summary>
        public List<Sede> Competenze { get; set; }

        /// <summary>
        ///   Complessità della richiesta
        /// </summary>
        public Complessita Complessita
        {
            get;
        }

        /// <summary>
        ///   Eventuale istante di presa in carico della richiesta
        /// </summary>
        [DataType(DataType.DateTime)]
        public DateTime? IstantePresaInCarico { get; set; }

        /// <summary>
        ///   Eventuale istante di prima assegnazione di risorse alla richiesta
        /// </summary>
        [DataType(DataType.DateTime)]
        public DateTime? IstantePrimaAssegnazione { get; set; }

        /// <summary>
        ///   Indica se la richiesta è stata marcata RILEVANTE
        /// </summary>
        /// <remarks>
        ///   Una richiesta può essere rilevante se è l'operatore a marcarla come tale, oppure in
        ///   base ad un insieme di regole automatiche deterministiche o basate su algoritmi di
        ///   machine learning.
        /// </remarks>
        public bool RilevanzaGrave { get; set; }

        /// <summary>
        ///   Indica se la rilevanza è di tipo Storico/Artistico/Culturale
        /// </summary>
        public bool RilevanzaStArCu { get; set; }

        /// <summary>
        ///   Codice della scheda Nue
        /// </summary>
        public virtual string CodiceSchedaNue { get; set; }

        /// <summary>
        ///   Descrizione delle zone di emergenza
        /// </summary>
        public string[] ZoneEmergenza { get; set; }

        /// <summary>
        ///   Codice dello stato di invio del fonogramma (0 = Non necessario, 1 = Da inviare, 2 =
        ///   Inviato). Utile a calcolare il colore della segnalazione.
        /// </summary>
        public virtual Classi.Soccorso.Fonogramma.IStatoFonogramma Fonogramma
        {
            get;
        }

        /// <summary>
        ///   Lista eventi associato alla richiesta
        /// </summary>
        public List<Partenza> Partenze { get; set; }

        /// <summary>
        ///   Etichette associate all'intervento (per es. aPagamento, imp, ecc.)
        /// </summary>
        public string[] Etichette { get; set; }

        public string NotePubbliche { get; set; }

        public string NotePrivate { get; set; }

        public bool Chiusa { get; set; }

        public bool Aperta { get; set; }

        public bool Sospesa { get; set; }

        public bool Presidiato { get; set; }
    }
}
