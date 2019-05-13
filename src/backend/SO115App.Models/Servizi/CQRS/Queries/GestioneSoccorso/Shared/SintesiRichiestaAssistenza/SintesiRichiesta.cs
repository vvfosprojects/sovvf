//-----------------------------------------------------------------------
// <copyright file="SintesiRichiesta.cs" company="CNVVF">
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
using SO115App.API.Models.Classi.Autenticazione;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Classi.Soccorso.Eventi;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using System;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza
{
    /// <summary>
    ///   Contiene le informazioni di sintesi di una Richiesta di Assistenza, utile ad alimentare il
    ///   primo ed il secondo livello di dettaglio del componente richiesta di assistenza sul frontend.
    /// </summary>
    public class SintesiRichiesta : IGetListaSintesiRichieste
    {
        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        public SintesiRichiesta()
        {
            this.ZoneEmergenza = new string[0];
            this.Etichette = new string[0];
            this.Eventi = new List<Evento>();
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
        public Utente Operatore { get; set; }

        /// <summary>
        ///   Ricezione della richiesta (via telefono, ecc.)
        /// </summary>
        public DateTime IstanteRicezioneRichiesta { get; set; }

        /// <summary>
        ///   Stato della richiesta
        /// </summary>
        public int Stato { get; set; }

        /// <summary>
        ///   Priorita della richiesta
        /// </summary>
        public RichiestaAssistenza.Priorita Priorita { get; set; }

        public List<Tipologia> Tipologie { get; set; }

        /// <summary>
        ///   Descrizione della richiesta
        /// </summary>
        public string Descrizione { get; set; }

        /// <summary>
        ///   Descrizione del richiedente
        /// </summary>
        public Richiedente Richiedente { get; set; }

        /// <summary>
        ///   Localita della richiesta
        /// </summary>
        public Localita Localita { get; set; }

        /// <summary>
        ///   Competenze della richiesta
        /// </summary>
        public List<Sede> Competenze { get; set; }

        /// <summary>
        ///   Complessità della richiesta
        /// </summary>
        public Complessita Complessita
        {
            get
            {
                int CountEventi;
                if (this.Eventi == null)
                {
                    CountEventi = 0;
                }
                else
                {
                    CountEventi = this.Eventi.Count;
                }

                if (CountEventi <= 20)
                {
                    return new Complessita("0", "Basso", CountEventi.ToString());
                }

                if (CountEventi <= 60)
                {
                    return new Complessita("1", "Media", CountEventi.ToString());
                }

                return new Complessita("2", "Alta", CountEventi.ToString());
            }
        }

        /// <summary>
        ///   Eventuale istante di presa in carico della richiesta
        /// </summary>
        public DateTime? IstantePresaInCarico { get; set; }

        /// <summary>
        ///   Eventuale istante di prima assegnazione di risorse alla richiesta
        /// </summary>
        public DateTime? IstantePrimaAssegnazione { get; set; }

        /// <summary>
        ///   Indica la data in cui è stato marcato RILEVANTE l'ultima volta
        /// </summary>
        /// <remarks>
        ///   Una richiesta può essere rilevante se è l'operatore a marcarla come tale, oppure in
        ///   base ad un insieme di regole automatiche deterministiche o basate su algoritmi di
        ///   machine learning.
        /// </remarks>
        public DateTime? Rilevanza { get; set; }

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
            get
            {
                if (this.Eventi != null)
                {
                    var ultimoEventoFonogramma = this.Eventi
                        .Where(e => e is Classi.Soccorso.Eventi.Fonogramma.IFonogramma)
                        .LastOrDefault();

                    if (ultimoEventoFonogramma is Classi.Soccorso.Eventi.Fonogramma.FonogrammaInviato)
                    {
                        return new Classi.Soccorso.Fonogramma.Inviato();
                    }

                    if (ultimoEventoFonogramma is Classi.Soccorso.Eventi.Fonogramma.InviareFonogramma)
                    {
                        return new Classi.Soccorso.Fonogramma.DaInviare();
                    }
                }

                return new Classi.Soccorso.Fonogramma.NonNecessario();
            }
        }

        /// <summary>
        ///  Lista eventi associato alla richiesta
        /// </summary>
        public List<Partenza> Partenze { get; set; }

        /// <summary>
        ///   Etichette associate all'intervento (per es. aPagamento, imp, ecc.)
        /// </summary>
        public string[] Etichette { get; set; }

        public string NotePubbliche { get; set; }

        public string NotePrivate { get; set; }

        /// <summary>
        ///  Lista eventi associato alla richiesta
        /// </summary>
        public List<Evento> Eventi { get; set; }
    }
}