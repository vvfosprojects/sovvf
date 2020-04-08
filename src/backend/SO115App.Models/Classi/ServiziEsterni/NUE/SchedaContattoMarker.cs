//-----------------------------------------------------------------------
// <copyright file="SchedaContattoMarker.cs" company="CNVVF">
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

namespace SO115App.Models.Classi.ServiziEsterni.NUE
{
    /// <summary>
    ///   modello per i marker delle schede contatto da visualizzare su mappa
    /// </summary>
    public class SchedaContattoMarker
    {
        /// <summary>
        ///   E' il codice della scheda contatto, proveniente dal NUE.
        /// </summary>
        public string CodiceScheda { get; set; }

        /// <summary>
        ///   E' la geolocalizzazione della scheda contatto.
        /// </summary>
        public Localita Localita { get; set; }

        /// <summary>
        ///   Contiente informazioni sul codice postazione dell'operatore che gestirà eventualmente
        ///   la scheda contatto
        /// </summary>
        public string CodiceOperatore { get; set; }

        /// <summary>
        ///   E' la priorità della scheda contatto, proveniente dal NUE.
        /// </summary>
        public int Priorita { get; set; }

        /// <summary>
        ///   Indica il tipo di scheda contatto: Competenza, Conoscenza, Differibile
        /// </summary>
        public string Classificazione { get; set; }

        /// <summary>
        ///   Indica se la scheda contatto è stata gestita o meno
        /// </summary>
        public bool Gestita { get; set; }
    }
}
