//-----------------------------------------------------------------------
// <copyright file="SintesiRichiestaAssistenzaResult.cs" company="CNVVF">
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

namespace Modello.Servizi.CQRS.Queries.GestioneSoccorso.RichiestaAssistenza.ResultDTO
{
    /// <summary>
    ///   Contiene le informazioni di sintesi di una Richiesta di Assistenza, utile ad alimentare il
    ///   primo ed il secondo livello di dettaglio del componente richiesta di assistenza sul frontend.
    /// </summary>
    public class SintesiRichiestaAssistenzaResult
    {
        /// <summary>
        ///   Priorità della richiesta
        /// </summary>
        public enum Priorita
        {
            /// <summary>
            ///   Priorità altissima
            /// </summary>
            Altissima = 0,

            /// <summary>
            ///   Priorità alta
            /// </summary>
            Alta,

            /// <summary>
            ///   Priorità media
            /// </summary>
            Media,

            /// <summary>
            ///   Priorità bassa
            /// </summary>
            Bassa,

            /// <summary>
            ///   Priorità bassissima
            /// </summary>
            Bassissima
        }

        /// <summary>
        ///   Indicazione dello stato del fonogramma
        /// </summary>
        public enum StatoFonogramma
        {
            /// <summary>
            ///   Il fonogramma non è necessario
            /// </summary>
            NonNecessario = 0,

            /// <summary>
            ///   Il fonogramma deve essere inviato ma non è stato inviato (rosso)
            /// </summary>
            NonInviato,

            /// <summary>
            ///   Il fonogramma è stato inviato
            /// </summary>
            DaInviare
        }

        /// <summary>
        ///   Indicazione della complessità di una richiesta di assistenza
        /// </summary>
        public enum Complessita
        {
            /// <summary>
            ///   Complessità alta
            /// </summary>
            Alta = 0,

            /// <summary>
            ///   Complessità media
            /// </summary>
            Media,

            /// <summary>
            ///   Complessità bassa
            /// </summary>
            Bassa
        }

        /// <summary>
        ///   L'id della richiesta
        /// </summary>
        public string Id { get; set; }

        /// <summary>
        ///   E' il codice della Richiesta di Assistenza
        /// </summary>
        public string Codice { get; set; }

        /// <summary>
        ///   Indica se la richiesta è stata marcata come rilevante dall'operatore
        /// </summary>
        public bool Rilevante { get; set; }

        /// <summary>
        ///   Ricezione della richiesta (via telefono, ecc.)
        /// </summary>
        public DateTime IstanteRicezioneRichiesta { get; set; }

        /// <summary>
        ///   Eventuale istante di prima assegnazione di risorse alla richiesta
        /// </summary>
        public DateTime IstantePrimaAssegnazione { get; set; }

        /// <summary>
        ///   Indica se il luogo del sinistro è presidiato con squadra VVF
        /// </summary>
        public bool Presidiato { get; set; }

        /// <summary>
        ///   Priorita della richiesta
        /// </summary>
        public Priorita PrioritaRichiesta { get; set; }

        /// <summary>
        ///   Descrizione delle tipologie
        /// </summary>
        public string[] Tipologie { get; set; }

        /// <summary>
        ///   Descrizione della richiesta
        /// </summary>
        public string Descrizione { get; set; }

        /// <summary>
        ///   Descrizione del richiedente
        /// </summary>
        public string Richiedente { get; set; }

        /// <summary>
        ///   Numero telefonico del richiedente (se appropriato)
        /// </summary>
        public string NumeroRichiedente { get; set; }

        /// <summary>
        ///   Descrizione della località della richiesta
        /// </summary>
        public string DescrizioneLocalita { get; set; }

        /// <summary>
        ///   Descrizione delle sedi di prima, seconda e terza competenza
        /// </summary>
        public string DescrizioneCompetenze { get; set; }

        /// <summary>
        ///   Note sulla località della richiesta (per es. "accanto a ingresso carico/scarico del
        ///   supermercato Spendibene")
        /// </summary>
        public string NoteLocalita { get; set; }

        /// <summary>
        ///   Descrizione delle zone di emergenza
        /// </summary>
        public string[] ZoneEmergenza { get; set; }

        /// <summary>
        ///   Eventuale istante di presa in carico della richiesta
        /// </summary>
        public DateTime IstantePresaInCarico { get; set; }

        /// <summary>
        ///   Codice della scheda nue
        /// </summary>
        public string CodiceSchedaNue { get; set; }

        /// <summary>
        ///   Codice dello stato di invio del fonogramma (per es. daInviare, inviato, nonNecessario).
        ///   Utile a calcolare il colore della segnalazione.
        /// </summary>
        public StatoFonogramma StatoFonogrammaRichiesta { get; set; }

        /// <summary>
        ///   Segnalazione sullo stato di invio del fonogramma.
        /// </summary>
        public string DescrizioneStatoFonogramma { get; set; }

        /// <summary>
        ///   Numero di eventi collegati alla richiesta (che è un'indicazione di massima sulla stima
        ///   della complessità dell'intervento)
        /// </summary>
        public int NumeroEventiGenerati { get; set; }

        /// <summary>
        ///   Codice della complessità dell'intervento (per es. bassa, media, alta). Utile a
        ///   calcolare il colore della segnalazione sulla complessità.
        /// </summary>
        public Complessita ComplessitaRichiesta { get; set; }

        /// <summary>
        ///   Segnalazione sulla complessità dell'intervento.
        /// </summary>
        public string DescrizioneComplessita { get; set; }

        /// <summary>
        ///   Dati sulle squadre coinvolte nella richiesta
        /// </summary>
        public Squadra[] Squadre { get; set; }

        /// <summary>
        ///   Dati sui mezzi impegnati sull'intervento
        /// </summary>
        public Mezzo[] Mezzi { get; set; }

        /// <summary>
        ///   Etichette associate all'intervento (per es. aPagamento, imp, ecc.)
        /// </summary>
        public string[] Etichette { get; set; }
    }
}
