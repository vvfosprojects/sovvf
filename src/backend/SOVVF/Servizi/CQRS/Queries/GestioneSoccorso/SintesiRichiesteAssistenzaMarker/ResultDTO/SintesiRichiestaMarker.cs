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
using System;
using System.Collections.Generic;
using Modello.Classi.Autenticazione;
using Modello.Classi.Condivise;
using Modello.Classi.Soccorso;
using Modello.Classi.Soccorso.Eventi;
using Modello.Classi.Soccorso.Fonogramma;
using Modello.Classi.Soccorso.Complessita;
using System.Linq;

namespace Modello.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza
{
    /// <summary>
    ///   Contiene le informazioni di sintesi di una Richiesta di Assistenza, utile ad alimentare il
    ///   primo ed il secondo livello di dettaglio del componente richiesta di assistenza sul frontend.
    /// </summary>
    public class SintesiRichiestaMarker
    {
        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        public SintesiRichiestaMarker()
        {  
  
        }

        /// <summary>
        ///   L'id della richiesta
        /// </summary>
        public string id { get; set; }

        /// <summary>
        ///   Localita della richiesta
        /// </summary>
        public Localita localita { get; set; }

        /// <summary>
        ///   Tipologia della richiesta
        /// </summary>
        public List<Tipologia> tipologie { get; set; }

        /// <summary>
        ///   Label della richiesta
        /// </summary>
        public string label { get; set; }

        /// <summary>
        ///   Priorita della richiesta
        /// </summary>
        public RichiestaAssistenza.Priorita priorita
        {
            get; set;
        }

        /// <summary>
        ///   Stato della richiesta
        /// </summary>
        public string stato { get; set; }

        /// <summary>
        ///   Indica la data in cui è stato marcato RILEVANTE l'ultima volta 
        /// </summary>
        /// <remarks>
        ///   Una richiesta può essere rilevante se è l'operatore a marcarla come tale, oppure in
        ///   base ad un insieme di regole automatiche deterministiche o basate su algoritmi di
        ///   machine learning.
        /// </remarks>
        public DateTime? rilevanza { get; set; }

        /// <summary>
        ///   Opacità della richiesta, serve per opacizzare i Marker che non sono rilevanti ai fini della ricerca effettuata
        /// </summary>
        public string opacita { get; set; }

    }
}
