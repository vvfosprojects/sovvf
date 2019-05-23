//-----------------------------------------------------------------------
// <copyright file="SintesiRichiestaMarker.cs" company="CNVVF">
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
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Soccorso;
using System;
using System.Collections.Generic;

namespace SO115App.API.Models.Classi.Marker
{
    /// <summary>
    /// Contiene le informazioni di sintesi di una Richiesta di Assistenza, utile ad alimentare il
    /// primo ed il secondo livello di dettaglio del componente richiesta di assistenza sul frontend.
    /// </summary>
    public class SintesiRichiestaMarker
    {
        /// <summary>
        /// Costruttore della classe
        /// </summary>
        public SintesiRichiestaMarker(string id, string codice, string codiceRichiesta, Localita localita, 
                                      List<Tipologia> Tipologie, string Descrizione, RichiestaAssistenza.Priorita PrioritaRichiesta,
                                      DateTime? Rilevante)
        {
            Id = id;
            Codice = codice;
            CodiceRichiesta = codiceRichiesta;
            Localita = localita;
            Tipologia = Tipologie;
            Label = Descrizione;
            Priorita = PrioritaRichiesta;

            if(Rilevante!=null)
                Rilevanza = Rilevante;

        }

        /// <summary>
        /// L'id della richiesta
        /// </summary>
        public string Id { get; set; }

        /// <summary>
        /// Identifica il codice della Chiamata
        /// </summary>
        public string Codice { get; set; }

        /// <summary>
        /// E' il codice della Richiesta di Assistenza
        /// </summary>
        public string CodiceRichiesta { get; set; }

        /// <summary>
        /// Localita della richiesta
        /// </summary>
        public Localita Localita { get; set; }

        /// <summary>
        /// Tipologia della richiesta
        /// </summary>
        public List<Tipologia> Tipologia { get; set; }

        /// <summary>
        /// Label della richiesta
        /// </summary>
        public string Label { get; set; }

        /// <summary>
        /// Priorita della richiesta
        /// </summary>
        public RichiestaAssistenza.Priorita Priorita
        {
            get; set;
        }

        /// <summary>
        /// Stato della richiesta
        /// </summary>
        public int Stato { get; set; }

        /// <summary>
        /// Indica la data in cui è stato marcato RILEVANTE l'ultima volta
        /// </summary>
        /// <remarks>
        /// Una richiesta può essere rilevante se è l'operatore a marcarla come tale, oppure in base
        /// ad un insieme di regole automatiche deterministiche o basate su algoritmi di machine learning.
        /// </remarks>
        public DateTime? Rilevanza { get; set; }

        /// <summary>
        /// Opacità della richiesta, serve per opacizzare i Marker che non sono rilevanti ai fini
        /// della ricerca effettuata
        /// </summary>
        //public string opacita { get; set; }
    }
}