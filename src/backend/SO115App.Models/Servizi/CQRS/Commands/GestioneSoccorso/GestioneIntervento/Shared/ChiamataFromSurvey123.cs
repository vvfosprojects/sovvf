//-----------------------------------------------------------------------
// <copyright file="ChiamataFromSurvey123.cs" company="CNVVF">
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
using SO115App.API.Models.Classi.Utenti;
using SO115App.Models.Classi.Condivise;
using System;
using System.Collections.Generic;

namespace SO115App.API.Models.Servizi.CQRS.Command.GestioneSoccorso.Shared
{
    /// <summary>
    ///   Contiene le informazioni di sintesi di una Richiesta di Assistenza, utile ad alimentare il
    ///   primo ed il secondo livello di dettaglio del componente richiesta di assistenza sul frontend.
    /// </summary>
    public class ChiamataFromSurvey123
    {

        public string Codice { get; set; }

        public string CodiceRichiesta { get; set; }

        public List<Tipologia> Tipologie { get; set; }

        public TipologiaDettaglio DettaglioTipologia { get; set; }

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
    }
}
