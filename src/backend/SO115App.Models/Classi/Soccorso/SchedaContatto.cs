//-----------------------------------------------------------------------
// <copyright file="SchedaContatto.cs" company="CNVVF">
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
using SO115App.API.Models.Classi.Condivise;

namespace SO115App.API.Models.Classi.Soccorso
{
    /// <summary>
    ///   E' l'estratto della scheda contatto che giunge dal NUE.
    /// </summary>
    public class SchedaContatto
    {
        /// <summary>
        ///   E' il codice della scheda contatto, proveniente dal NUE.
        /// </summary>
        public string Id { get; set; }

        /// <summary>
        ///   E' la data inserimento della scheda contatto, proveniente dal NUE.
        /// </summary>
        public DateTime DataInserimento { get; set; }

        /// <summary>
        ///   E' il richiedente della scheda contatto, proveniente dal NUE.
        /// </summary>
        public Richiedente Richiedente { get; set; }

        /// <summary>
        ///   E' la localita della scheda contatto, proveniente dal NUE.
        /// </summary>
        public Localita Localita { get; set; }

        /// <summary>
        ///   E' la classificazione dell'evento della scheda contatto, proveniente dal NUE.
        /// </summary>
        public string ClassificazioneEvento { get; set; }

        /// <summary>
        ///   E' la categoria della scheda contatto, proveniente dal NUE.
        /// </summary>
        public string Categoria { get; set; }

        /// <summary>
        ///   Indica la competenza della scheda contatto, proveniente dal NUE.
        /// </summary>
        public string CompetenzaCC_PS { get; set; }

        /// <summary>
        ///   E' il dettaglio della scheda contatto, proveniente dal NUE.
        /// </summary>
        public string Dettaglio { get; set; }

        /// <summary>
        ///   E' la priorità della scheda contatto, proveniente dal NUE.
        /// </summary>
        public RichiestaAssistenza.Priorita Priorita { get; set; }

        /// <summary>
        ///   E' il numero delle persone coinvolte provenienti dalla scheda contatto, proveniente dal NUE.
        /// </summary>
        public int NumeroPersoneCoinvolte { get; set; }
    }
}
